import { DataSource } from "typeorm";
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
    timeFrameId: number
  ): Promise<TimeFrame | null> {
    const repo = this.dataSource.getRepository(TimeFrame);
    return repo.findOne({ where: { id: timeFrameId } });
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

  async createAppointment(dto: CreateAppointmentDTO): Promise<Appointments> {
    const repo = this.dataSource.getRepository(Appointments);

    const doctor = await this.checkDoctorExists(dto.doctorId);
    if (!doctor) throw new Error("Bác sĩ không tồn tại");

    const patient = await this.checkPatientExists(dto.patientId);
    if (!patient) throw new Error("Bệnh nhân không tồn tại");

    const timeFrame = await this.checkTimeFrameExists(dto.timeFrameId);
    if (!timeFrame) throw new Error("Khung giờ không tồn tại");

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

    const email = patient.email;
    const name = patient.fullName;
    const appointmentDate = appointment.date;

    const saveAppointment = await repo.save(appointment);
    if (saveAppointment) {
      await sendAppointmentConfirmation(email, name, new Date(appointmentDate));
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
          AppointmentStatus.IN_PROGRESS,
          AppointmentStatus.CANCELLED,
          AppointmentStatus.NO_SHOW,
        ],
        [AppointmentStatus.IN_PROGRESS]: [AppointmentStatus.COMPLETED],
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
    }
    if (dto.notes !== undefined) appointment.notes = dto.notes;

    return repo.save(appointment);
  }

  async getAppointmentById(id: number): Promise<Appointments | null> {
    const repo = this.dataSource.getRepository(Appointments);
    return repo.findOne({
      where: { id },
      relations: ["doctor", "patient", "timeFrame", "medicalRecord"],
    });
  }

  async getDoctorAppointments(
    doctorId: number,
    date: string
  ): Promise<Appointments[]> {
    const repo = this.dataSource.getRepository(Appointments);
    return repo.find({
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
