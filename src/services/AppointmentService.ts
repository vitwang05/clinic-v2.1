import { DataSource, In } from "typeorm";
import { Appointments } from "../orm/entities/Appointments";
import { Employees } from "../orm/entities/Employees";
import { Patients } from "../orm/entities/Patients";
import { TimeFrame } from "../orm/entities/TimeFrame";
import {
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
  AppointmentStatus,
} from "../dtos/appointment/appointment.dto";
import { sendAppointmentConfirmation } from "./EmailService";
import { MedicalRecord } from "../orm/entities/MedicalRecord";
import { Services } from "../orm/entities/Services";
import { AppointmentServices } from "../orm/entities/AppointmentService";
import { TimeFrameService } from "./TimeFrameService";
import { EmployeeShift } from "../orm/entities/EmployeeShift";
import { TimeFrameRepository } from "../repositories/TimeFrameRepository";
import { EmployeeShiftRepository } from "../repositories/EmployeeShiftRepository";
export class AppointmentService {
  constructor(
    private readonly dataSource: DataSource // Inject AppDataSource ở ngoài
  ) {}

  private async checkDoctorExists(doctorId: number): Promise<Employees | null> {
    const repo = this.dataSource.getRepository(Employees);
    return repo.findOne({ where: { id: doctorId } });
  }

  private async checkPatientExists(
    patientId: number
  ): Promise<Patients | null> {
    const repo = this.dataSource.getRepository(Patients);
    return repo.findOne({ where: { id: patientId } });
  }

  private async checkTimeFrameExists(
    timeFrameId: number,
    doctorId: number,
    date: string
  ): Promise<TimeFrame | null> {
    const repo = this.dataSource.getRepository(TimeFrame);
    const timeFrame = await repo.findOne({ where: { id: timeFrameId } });
    console.log(timeFrame);
    if (!timeFrame) throw new Error("Khung giờ không tồn tại");
    const timeFrameService = new TimeFrameService(new TimeFrameRepository(this.dataSource), new EmployeeShiftRepository(this.dataSource));
    const employeeShift = await timeFrameService.getDoctorTimeFrames({
      doctorId: doctorId,
      date: date,
    });
    console.log(employeeShift);
    if (!employeeShift.some((frame) => frame.id === timeFrame.id)) throw new Error("Khung giờ không tồn tại");
    return timeFrame;
  }

  private async checkAppointmentOverlap(
    doctorId: number,
    timeFrameId: number,
    date: string
  ): Promise<boolean> {
    const repo = this.dataSource.getRepository(Appointments);
    const existing = await repo.findOne({
      where: {
        doctor: { id: doctorId },
        timeFrame: { id: timeFrameId },
        date: date,
      },
    });
    return !!existing;
  }

  private async checkServicesExists(services: number[]): Promise<boolean> {
    const repo = this.dataSource.getRepository(Services);
    const existing = await repo.find({ where: { id: In(services) } });
    return existing.length === services.length;
  }

  private async createAppointmentServices(appointment: Appointments, service: number[]): Promise<void> {
    const repo = this.dataSource.getRepository(AppointmentServices);
    const services = await this.dataSource.getRepository(Services).find({where: {id: In(service) } });
    const appointmentServices = services.map((service) => ({
      appointment,
      service,
    }));
    await repo.save(appointmentServices);
  }

  async createAppointment(dto: CreateAppointmentDTO): Promise<Appointments> {
    const repo = this.dataSource.getRepository(Appointments);

    const doctor = await this.checkDoctorExists(dto.doctorId);
    if (!doctor) throw new Error("Bác sĩ không tồn tại");

    const patient = await this.checkPatientExists(dto.patientId);
    if (!patient) throw new Error("Bệnh nhân không tồn tại");

    const timeFrame = await this.checkTimeFrameExists(dto.timeFrameId, dto.doctorId, dto.date);
    if (!timeFrame) throw new Error("Khung giờ không tồn tại");


    if(dto.date < new Date().toISOString().split('T')[0]) throw new Error("Ngày khám không được trong quá khứ");

    if (dto.services?.length !== 0) {
      const services = await this.checkServicesExists(dto.services);
      if (!services) throw new Error("Dịch vụ không tồn tại");
    }
    const isOverlap = await this.checkAppointmentOverlap(
      dto.doctorId,
      dto.timeFrameId,
      dto.date
    );
    if (isOverlap) throw new Error("Khung giờ này đã được đặt");

    const appointment = repo.create({
      doctor,
      patient,
      timeFrame,
      date: dto.date,
      status: AppointmentStatus.PENDING,
      notes: dto.notes,
    });

    if(dto.isWalkIn) {
      appointment.isWalkIn = true;
      appointment.status = AppointmentStatus.WAITING;
    }

    const email = patient.email;
    const name = patient.fullName;
    const appointmentDate = appointment.date;

    const saveAppointment = await repo.save(appointment);
    if (saveAppointment) {
      await sendAppointmentConfirmation(email, name, new Date(appointmentDate));
      await this.createAppointmentServices(saveAppointment, dto.services);
    }
    return saveAppointment;
  }

  async updateAppointment(
    id: number,
    dto: UpdateAppointmentDTO
  ): Promise<Appointments | null> {
    const repo = this.dataSource.getRepository(Appointments);
    const appointment = await repo.findOne({
      where: { id },
      relations: ["doctor", "patient", "timeFrame"],
    });

    if (!appointment) return null;

    if (dto.status) {
      const current = appointment.status;
      const next = dto.status;

      const validTransitions: Record<AppointmentStatus, AppointmentStatus[]> = {
        [AppointmentStatus.PENDING]: [
          AppointmentStatus.CONFIRMED,
          AppointmentStatus.CANCELLED,
        ],
      
        [AppointmentStatus.CONFIRMED]: [
          AppointmentStatus.CHECKED_IN,
          AppointmentStatus.CANCELLED,
          AppointmentStatus.NO_SHOW,
        ],
      
        [AppointmentStatus.CHECKED_IN]: [
          AppointmentStatus.WAITING,
          AppointmentStatus.CANCELLED,
        ],
      
        [AppointmentStatus.WAITING]: [
          AppointmentStatus.CALLED,
          AppointmentStatus.CANCELLED,
        ],
      
        [AppointmentStatus.CALLED]: [
          AppointmentStatus.IN_PROGRESS,
          AppointmentStatus.CANCELLED,
        ],
      
        [AppointmentStatus.IN_PROGRESS]: [
          AppointmentStatus.COMPLETED,
          AppointmentStatus.CANCELLED,
        ],
      
        [AppointmentStatus.COMPLETED]: [],
      
        [AppointmentStatus.CANCELLED]: [],
      
        [AppointmentStatus.NO_SHOW]: [],
      };
      

      if (!validTransitions[current].includes(next)) {
        throw new Error(
          `Không thể chuyển trạng thái từ ${current} sang ${next}`
        );
      }

      appointment.status = next;
      if (next === AppointmentStatus.IN_PROGRESS) {
        const medicalRecord = await this.dataSource.getRepository(MedicalRecord).create({
          appointmentId: appointment.id,
          diagnosis: null,
        });
        await this.dataSource.getRepository(MedicalRecord).save(medicalRecord);
      }
      if (next === AppointmentStatus.CHECKED_IN) {
        appointment.checkInTime = new Date();
      }
      if (next === AppointmentStatus.WAITING) {
        appointment.startTime = new Date();
      }
      if (next === AppointmentStatus.CALLED) {
        appointment.calledInTime = new Date();
      }
      if (next === AppointmentStatus.COMPLETED || next === AppointmentStatus.CANCELLED) {
        appointment.endTime = new Date();
      }
    }
    if (dto.notes !== undefined) appointment.notes = dto.notes;

    return repo.save(appointment);
  }

  async getAppointmentById(id: number): Promise<Appointments | null> {
    const repo = this.dataSource.getRepository(Appointments);
    return repo.findOne({
      where: { id },
      relations: ["doctor", "patient", "timeFrame", "medicalRecord", "appointmentServices.service"],
    });
  }

  async getDoctorAppointments(
    doctorId: number,
    date: string
): Promise<Appointments[]> {
    const repo = this.dataSource.getRepository(Appointments);

    const today = new Date();
    const inputDate = new Date(date);

    // Kiểm tra nếu ngày truyền vào là quá khứ
    const isPastDate = inputDate.getTime() < today.setHours(0, 0, 0, 0); 

    // Lấy tất cả lịch hẹn của bác sĩ trong ngày
    const appointments = await repo.find({
        where: {
            doctor: { id: doctorId },
            date: date,
        },
        relations: ["patient", "timeFrame", "medicalRecord"],
        order: {
            timeFrame: {
                startTime: "ASC",
            },
        },
    });

    const now = new Date();

    // Phân loại các bệnh nhân
    const onTimeNonWalkIns: Appointments[] = [];
    const lateNonWalkIns: Appointments[] = [];
    const walkIns: Appointments[] = [];

    for (const appt of appointments) {
        const isLate =
            !appt.isWalkIn &&
            appt.status === "waiting" &&
            new Date(appt.timeFrame.startTime) < now;

        if (appt.isWalkIn) {
            walkIns.push(appt);
        } else if (isLate) {
            lateNonWalkIns.push(appt);
        } else {
            onTimeNonWalkIns.push(appt);
        }
    }

    if (isPastDate) {
        // Sắp xếp các nhóm lịch hẹn trong quá khứ theo status và thời gian
        appointments.sort((a, b) => {
            const statusPriority = {
                'waiting': 0,
                'called': 1,
                'in_progress': 2,
                'completed': 3,
                'cancelled': 4,
                'no_show': 5,
                'pending': 6,
                'confirmed': 7,
                'checked_in': 8,
            };

            // Sắp xếp theo status
            const statusComparison = statusPriority[a.status] - statusPriority[b.status];
            if (statusComparison !== 0) {
                return statusComparison;
            }

            // Nếu status giống nhau, sắp xếp theo thời gian
            return new Date(a.timeFrame.startTime).getTime() - new Date(b.timeFrame.startTime).getTime();
        });
    } else {
        // Sắp xếp các nhóm lịch hẹn còn lại (ngày hiện tại hoặc tương lai)
        onTimeNonWalkIns.sort(
            (a, b) =>
                new Date(a.timeFrame.startTime).getTime() -
                new Date(b.timeFrame.startTime).getTime()
        );

        walkIns.sort((a, b) => {
            const aTime = a.checkInTime?.getTime() || 0;
            const bTime = b.checkInTime?.getTime() || 0;
            return aTime - bTime;
        });

        lateNonWalkIns.sort(
            (a, b) =>
                new Date(a.timeFrame.startTime).getTime() -
                new Date(b.timeFrame.startTime).getTime()
        );

        // Gán số thứ tự cho walk-in (chỉ gán trong bộ nhớ mà không cần lưu vào DB)
        walkIns.forEach((appt, index) => {
            // Gán STT cho các bệnh nhân walk-in
            appt.queueNumber = index + 1;
        });
    }

    const finalQueue = [...onTimeNonWalkIns, ...walkIns, ...lateNonWalkIns];

    return finalQueue;
}


  


  async getPatientAppointments(patientId: number): Promise<Appointments[]> {
    const repo = this.dataSource.getRepository(Appointments);
    return repo.find({
      where: {
        patient: { id: patientId },
      },
      relations: ["doctor", "timeFrame", "medicalRecord"],
      order: {
        date: "DESC",
        timeFrame: {
          startTime: "ASC",
        },
      },
    });
  }
}
