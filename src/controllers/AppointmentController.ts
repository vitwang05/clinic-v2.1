import { Request, Response } from 'express';
import { AppointmentService } from '../services/AppointmentService';
import { CreateAppointmentDTO } from '../dtos/appointment/appointment.dto';
import { UpdateAppointmentDTO } from '../dtos/appointment/appointment.dto';
import { ApiResponse } from '../utils/ApiResponse';

export class AppointmentController {
    constructor(private appointmentService: AppointmentService) {}

    async createAppointment(req: Request, res: Response): Promise<void> {
        try {
            
            const dto: CreateAppointmentDTO = req.body;
            if((req as any).user?.role.name === 'receptionist') {
                dto.isWalkIn = true;
            }
            console.log(dto);
            const appointment = await this.appointmentService.createAppointment(dto);
            res.status(201).json(ApiResponse.success(appointment));
        } catch (error) {
            res.status(400).json(ApiResponse.error(error.message));
        }
    }

    async updateAppointment(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            const dto: UpdateAppointmentDTO = req.body;
            const appointment = await this.appointmentService.updateAppointment(id, dto);
            
            if (!appointment) {
                res.status(404).json(ApiResponse.error('Lịch khám không tồn tại'));
                return;
            }

            res.status(200).json(ApiResponse.success(appointment));
        } catch (error) {
            res.status(400).json(ApiResponse.error(error.message));
        }
    }

    async getAppointmentById(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            const appointment = await this.appointmentService.getAppointmentById(id);
            
            if (!appointment) {
                res.status(404).json(ApiResponse.error('Lịch khám không tồn tại'));
                return;
            }

            res.status(200).json(ApiResponse.success(appointment));
        } catch (error) {
            res.status(500).json(ApiResponse.error(error.message));
        }
    }

    async getDoctorAppointments(req: Request, res: Response): Promise<void> {
        try {
            const doctorId = Number(req.params.doctorId);
            const date = req.params.date;
            const appointments = await this.appointmentService.getDoctorAppointments(doctorId, date);
            res.status(200).json(ApiResponse.success(appointments));
        } catch (error) {
            res.status(500).json(ApiResponse.error(error.message));
        }
    }

    async getPatientAppointments(req: Request, res: Response): Promise<void> {
        try { 
            const patientId = Number(req.params.patientId);
            const appointments = await this.appointmentService.getPatientAppointments(patientId);
            res.status(200).json(ApiResponse.success(appointments));
        } catch (error) {
            res.status(500).json(ApiResponse.error(error.message));
        }
    }
} 