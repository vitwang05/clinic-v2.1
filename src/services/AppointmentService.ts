import { DataSource } from 'typeorm';
import { AppDataSource } from '../orm/dbCreateConnection';
import { Appointments } from '../orm/entities/Appointments';
import { Employees } from '../orm/entities/Employees';
import { Patients } from '../orm/entities/Patients';
import { TimeFrame } from '../orm/entities/TimeFrame';
import { CreateAppointmentDTO, UpdateAppointmentDTO, AppointmentStatus } from '../dtos/appointment/appointment.dto';

export class AppointmentService {
    private dataSource: DataSource | null = null;
    private initializationPromise: Promise<void>;

    constructor() {
        this.initializationPromise = this.initializeDataSource();
    }

    private async initializeDataSource() {
        this.dataSource = await AppDataSource();
    }

    private async ensureInitialized() {
        await this.initializationPromise;
    }

    private async checkDoctorExists(doctorId: number): Promise<Employees | null> {
        const employeeRepo = this.dataSource!.getRepository(Employees);
        return await employeeRepo.findOne({ where: { id: doctorId } });
    }

    private async checkPatientExists(patientId: number): Promise<Patients | null> {
        const patientRepo = this.dataSource!.getRepository(Patients);
        return await patientRepo.findOne({ where: { id: patientId } });
    }

    private async checkTimeFrameExists(timeFrameId: number): Promise<TimeFrame | null> {
        const timeFrameRepo = this.dataSource!.getRepository(TimeFrame);
        return await timeFrameRepo.findOne({ where: { id: timeFrameId } });
    }

    private async checkAppointmentOverlap(doctorId: number, timeFrameId: number, date: string): Promise<boolean> {
        const appointmentRepo = this.dataSource!.getRepository(Appointments);
        const existing = await appointmentRepo.findOne({
            where: {
                doctor: { id: doctorId },
                timeFrame: { id: timeFrameId },
                date: date
            }
        });
        return !!existing;
    }

    async createAppointment(dto: CreateAppointmentDTO): Promise<Appointments> {
        await this.ensureInitialized();
        const appointmentRepo = this.dataSource!.getRepository(Appointments);

        const doctor = await this.checkDoctorExists(dto.doctorId);
        if (!doctor) {
            throw new Error('Bác sĩ không tồn tại');
        }

        const patient = await this.checkPatientExists(dto.patientId);
        if (!patient) {
            throw new Error('Bệnh nhân không tồn tại');
        }

        const timeFrame = await this.checkTimeFrameExists(dto.timeFrameId);
        if (!timeFrame) {
            throw new Error('Khung giờ không tồn tại');
        }

        const isOverlap = await this.checkAppointmentOverlap(dto.doctorId, dto.timeFrameId, dto.date);
        if (isOverlap) {
            throw new Error('Khung giờ này đã được đặt');
        }

        const appointment = appointmentRepo.create({
            doctor,
            patient,
            timeFrame,
            date: dto.date,
            status: AppointmentStatus.PENDING,
            notes: dto.notes
        });

        return await appointmentRepo.save(appointment);
    }

    async updateAppointment(id: number, dto: UpdateAppointmentDTO): Promise<Appointments | null> {
        await this.ensureInitialized();
        const appointmentRepo = this.dataSource!.getRepository(Appointments);

        const appointment = await appointmentRepo.findOne({
            where: { id },
            relations: ['doctor', 'patient', 'timeFrame']
        });

        if (!appointment) {
            return null;
        }

        if (dto.status) {
            appointment.status = dto.status;
        }

        if (dto.notes !== undefined) {
            appointment.notes = dto.notes;
        }

        return await appointmentRepo.save(appointment);
    }

    async getAppointmentById(id: number): Promise<Appointments | null> {
        await this.ensureInitialized();
        const appointmentRepo = this.dataSource!.getRepository(Appointments);
        return await appointmentRepo.findOne({
            where: { id },
            relations: ['doctor', 'patient', 'timeFrame']
        });
    }

    async getDoctorAppointments(doctorId: number, date: string): Promise<Appointments[]> {
        await this.ensureInitialized();
        const appointmentRepo = this.dataSource!.getRepository(Appointments);
        return await appointmentRepo.find({
            where: {
                doctor: { id: doctorId },
                date: date
            },
            relations: ['patient', 'timeFrame'],
            order: {
                timeFrame: {
                    startTime: 'ASC'
                }
            }
        });
    }


    async getPatientAppointments(patientId: number): Promise<Appointments[]> {
        await this.ensureInitialized();
        const appointmentRepo = this.dataSource!.getRepository(Appointments);
        return await appointmentRepo.find({
            where: {
                patient: { id: patientId }
            },
            relations: ['doctor', 'timeFrame'],
            order: {
                date: 'DESC',
                timeFrame: {
                    startTime: 'ASC'
                }
            }
        });
    }
}
