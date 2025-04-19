import { DataSource } from 'typeorm';
import { AppDataSource } from '../orm/dbCreateConnection';
import { Appointments } from '../orm/entities/Appointments';
import { Employees } from '../orm/entities/Employees';
import { Patients } from '../orm/entities/Patients';
import { TimeFrame } from '../orm/entities/TimeFrame';
import { CreateAppointmentDTO } from '../dtos/appointment/appointment.dto';
import { UpdateAppointmentDTO } from '../dtos/appointment/appointment.dto';
import { AppointmentStatus } from '../dtos/appointment/appointment.dto';

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

    async createAppointment(dto: CreateAppointmentDTO): Promise<Appointments> {
        await this.ensureInitialized();
        const appointmentRepository = this.dataSource!.getRepository(Appointments);
        const doctorRepository = this.dataSource!.getRepository(Employees);
        const patientRepository = this.dataSource!.getRepository(Patients);
        const timeFrameRepository = this.dataSource!.getRepository(TimeFrame);

        // Kiểm tra bác sĩ tồn tại
        const doctor = await doctorRepository.findOne({ where: { id: dto.doctorId } });
        if (!doctor) {
            throw new Error('Bác sĩ không tồn tại');
        }

        // Kiểm tra bệnh nhân tồn tại
        const patient = await patientRepository.findOne({ where: { id: dto.patientId } });
        if (!patient) {
            throw new Error('Bệnh nhân không tồn tại');
        }

        // Kiểm tra khung giờ tồn tại
        const timeFrame = await timeFrameRepository.findOne({ where: { id: dto.timeFrameId } });
        if (!timeFrame) {
            throw new Error('Khung giờ không tồn tại');
        }

        // Kiểm tra lịch khám trùng
        const existingAppointment = await appointmentRepository.findOne({
            where: {
                doctor: { id: dto.doctorId },
                timeFrame: { id: dto.timeFrameId },
                date: dto.date
            }
        });

        if (existingAppointment) {
            throw new Error('Khung giờ này đã được đặt');
        }

        // Tạo lịch khám mới
        const appointment = appointmentRepository.create({
            doctor: doctor,
            patient: patient,
            timeFrame: timeFrame,
            date: dto.date,
            status: AppointmentStatus.PENDING,
            notes: dto.notes
        });

        return appointmentRepository.save(appointment);
    }

    async updateAppointment(id: number, dto: UpdateAppointmentDTO): Promise<Appointments | null> {
        await this.ensureInitialized();
        const appointmentRepository = this.dataSource!.getRepository(Appointments);

        const appointment = await appointmentRepository.findOne({
            where: { id },
            relations: ['doctor', 'patient', 'timeFrame']
        });

        if (!appointment) {
            return null;
        }

        // Cập nhật thông tin
        if (dto.status) {
            appointment.status = dto.status;
        }
        if (dto.notes !== undefined) {
            appointment.notes = dto.notes;
        }

        return appointmentRepository.save(appointment);
    }

    async getAppointmentById(id: number): Promise<Appointments | null> {
        await this.ensureInitialized();
        const appointmentRepository = this.dataSource!.getRepository(Appointments);
        return appointmentRepository.findOne({
            where: { id },
            relations: ['doctor', 'patient', 'timeFrame']
        });
    }

    async getDoctorAppointments(doctorId: number, date: string): Promise<Appointments[]> {
        await this.ensureInitialized();
        const appointmentRepository = this.dataSource!.getRepository(Appointments);
        return appointmentRepository.find({
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
        const appointmentRepository = this.dataSource!.getRepository(Appointments);
        return appointmentRepository.find({
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