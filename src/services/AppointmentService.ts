import { DataSource, In, IsNull, Not } from "typeorm";
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
    return repo.findOne({ where: { id: patientId }, relations: ["user"] });
  }

  private async checkTimeFrameExists(
    timeFrameId: number,
    doctorId: number,
    date: string
  ): Promise<TimeFrame | null> {
    const repo = this.dataSource.getRepository(TimeFrame);
    const timeFrame = await repo.findOne({ where: { id: timeFrameId } });
   
    if (!timeFrame) throw new Error("Khung giờ không tồn tại");
    const timeFrameService = new TimeFrameService(
      new TimeFrameRepository(this.dataSource),
      new EmployeeShiftRepository(this.dataSource)
    );
    const employeeShift = await timeFrameService.getDoctorTimeFrames({
      doctorId: doctorId,
      date: date,
    });
   
    if (!employeeShift.some((frame) => frame.id === timeFrame.id))
      throw new Error("Khung giờ không tồn tại");
    return timeFrame;
  }

  private async checkAppointmentOverlap(
    doctorId: number,
    timeFrameId: number,
    date: string,
    patientId: number | null
  ): Promise<boolean> {
    const repo = this.dataSource.getRepository(Appointments);
    const existing = await repo.findOne({
      where: {
        doctor: { id: doctorId },
        timeFrame: { id: timeFrameId },
        date: date,
      },relations:["patient.user"]
    });
    const userId = existing?.patient?.user?.id;

    if (userId != null && patientId != null && userId === patientId) {
      throw new Error(
        "Hệ thống đã nhận được yêu cầu của bạn. Vui lòng chờ xác nhận từ bác sĩ!"
      );
    }
    return !!existing;
  }

  private async checkServicesExists(services: number[]): Promise<boolean> {
    const repo = this.dataSource.getRepository(Services);
    const existing = await repo.find({ where: { id: In(services) } });
    return existing.length === services.length;
  }

  private async createAppointmentServices(
    appointment: Appointments,
    service: number[]
  ): Promise<void> {
    const repo = this.dataSource.getRepository(AppointmentServices);
    const services = await this.dataSource
      .getRepository(Services)
      .find({ where: { id: In(service) } });
    const appointmentServices = services.map((service) => ({
      appointment,
      service,
    }));
    await repo.save(appointmentServices);
  }

  async createAppointment(dto: CreateAppointmentDTO, userId: number|null): Promise<Appointments> {
    const repo = this.dataSource.getRepository(Appointments);

    const doctor = await this.checkDoctorExists(dto.doctorId);
    console.log(doctor);
    if (!doctor) throw new Error("Bác sĩ không tồn tại");

    const patient = await this.checkPatientExists(dto.patientId);
    console.log(patient);
    if (!patient) throw new Error("Bệnh nhân không tồn tại");
    if(userId && patient?.user?.id !== userId) throw new Error("Bạn không có quyền tạo lịch hẹn cho bệnh nhân này");
    let timeFrame: TimeFrame | null = null;
    if(dto.timeFrameId) {
      timeFrame = await this.checkTimeFrameExists(
        dto.timeFrameId,
        dto.doctorId,
        dto.date
      );
      if (!timeFrame) throw new Error("Khung giờ không tồn tại");
    }

    if (dto.date < new Date().toISOString().split("T")[0])
      throw new Error("Ngày khám không được trong quá khứ");

    if (dto.services?.length !== 0) {
  
      const services = await this.checkServicesExists(dto.services);
      if (!services) throw new Error("Dịch vụ không tồn tại");
    }
    const isOverlap = await this.checkAppointmentOverlap(
      dto.doctorId,
      dto.timeFrameId,
      dto.date,
      patient?.user?.id ?? null
    );
    console.log(isOverlap);
    if (isOverlap) throw new Error("Khung giờ này đã được đặt");

    const appointment = repo.create({
      doctor,
      patient,
      timeFrame,
      date: dto.date,
      status: AppointmentStatus.PENDING,
      notes: dto.notes,
    });

    if (dto.isWalkIn) {
      appointment.isWalkIn = true;
      appointment.status = AppointmentStatus.WAITING;
      const queueNumber = await this.assignQueueNumbers(
        dto.doctorId,
        dto.date
      );
      appointment.checkInTime = new Date();
      appointment.queueNumber = queueNumber;
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
        const medicalRecord = await this.dataSource
          .getRepository(MedicalRecord)
          .create({
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
      if (
        next === AppointmentStatus.COMPLETED ||
        next === AppointmentStatus.CANCELLED
      ) {
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
      relations: [
        "doctor",
        "patient",
        "timeFrame",
        "medicalRecord",
        "appointmentServices.service",
      ],
    });
  }

  async getDoctorAppointments(
    doctorId: number,
    date: string,
    userId: number | null
  ): Promise<Appointments[]> {
    const repo = this.dataSource.getRepository(Appointments);
    if(userId) {
      console.log("run");
      const doctor = await this.dataSource.getRepository(Employees).findOne({
        where: {
          user: {
            id: userId,
          },
        },
      });
      console.log(doctor);
      doctorId = doctor?.id;
    }
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

    return appointments;
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

  async assignQueueNumbers(doctorId: number, date: string): Promise<number> {
    const appointments = await this.dataSource
      .getRepository(Appointments)
      .find({
        where: {
          doctor: { id: doctorId },
          date: date,
          isWalkIn: true,
        },
      });

    const queueNumber = appointments.length + 1;

    return queueNumber;
  }

  async getAppointmentStatistics(): Promise<{
    statusSummary: { label: string; value: number }[];
    hourlyTraffic: { label: string; value: number }[];
    weekdayTraffic: { label: string; value: number }[];
    avgDurations: { label: string; value: number }[]; 
  }> {
    const repo = this.dataSource.getRepository(Appointments);
  
    const appointments = await repo.find({
      where: { checkInTime: Not(IsNull()) },
      select: ['status', 'checkInTime', 'calledInTime', 'startTime', 'endTime'],
    });
  
    // --- 1. Thống kê trạng thái
    const statusCount: Record<string, number> = {};
    for (const a of appointments) {
      statusCount[a.status] = (statusCount[a.status] || 0) + 1;
    }
  
    const statusSummary = Object.entries(statusCount).map(([label, value]) => ({ label, value }));
  
    // --- 2. Thống kê số lượng theo giờ trong ngày
    const hourlyTraffic: Record<string, number> = {};
    for (let h = 0; h < 24; h++) {
      hourlyTraffic[`${h.toString().padStart(2, '0')}:00`] = 0;
    }
  
    // --- 3. Thống kê theo thứ trong tuần
    const weekdayTraffic: Record<string, number> = {
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
      Sunday: 0,
    };
  
    // --- 4. Tính thời lượng trung bình giữa các trạng thái
    let totalCheckInToCalled = 0;
    let countCheckInToCalled = 0;
  
    let totalCalledToStart = 0;
    let countCalledToStart = 0;
  
    let totalStartToEnd = 0;
    let countStartToEnd = 0;
  
    for (const a of appointments) {
      const d = new Date(a.checkInTime);
      const hour = `${d.getHours().toString().padStart(2, '0')}:00`;
      const day = d.toLocaleString("en-US", { weekday: "long" });
  
      hourlyTraffic[hour]++;
      weekdayTraffic[day]++;
  
      if (a.checkInTime && a.startTime) {
        totalCheckInToCalled += (a.startTime.getTime() - a.checkInTime.getTime()) / 60000;
        countCheckInToCalled++;
      }
  
      if (a.calledInTime && a.startTime) {
        totalCalledToStart += (a.calledInTime.getTime() - a.startTime.getTime()) / 60000;
        countCalledToStart++;
      }
  
      if (a.calledInTime && a.endTime) {
        totalStartToEnd += (a.endTime.getTime() - a.calledInTime.getTime()) / 60000;
        countStartToEnd++;
      }
    }
  
    const convertToArray = (obj: Record<string, number>) =>
      Object.entries(obj).map(([label, value]) => ({ label, value }));
  
    return {
      statusSummary,
      hourlyTraffic: convertToArray(hourlyTraffic),
      weekdayTraffic: convertToArray(weekdayTraffic),
      avgDurations: [
        {
          label: "Thời gian từ check-in đến chờ gọi",
          value: countCheckInToCalled ? +(totalCheckInToCalled / countCheckInToCalled).toFixed(2) : 0
        },
        {
          label: "Thời gian chờ được gọi",
          value: countCalledToStart ? +(totalCalledToStart / countCalledToStart).toFixed(2) : 0
        },
        {
          label: "Thời gian khám",
          value: countStartToEnd ? +(totalStartToEnd / countStartToEnd).toFixed(2) : 0
        }
      ]
    };
  }
}
