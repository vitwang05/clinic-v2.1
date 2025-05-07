import { Request, Response } from 'express';
import { PatientsService } from '../services/PatientsService';
import { ApiResponse } from '../utils/ApiResponse';
import { CreatePatientDTO } from '../dtos/patient/patient.dto';
import { UpdatePatientDTO } from '../dtos/patient/patient.dto';

export class PatientsController {
    constructor(private patientsService: PatientsService) {}

    async getAllPatients(req: Request, res: Response): Promise<void> {
        if ((req as any).user?.role.name !== 'admin') {
            const patients = await this.patientsService.getPatientsByUserId((req as any).user?.userId);
            res.status(200).json(ApiResponse.success(patients));    
        } else {
            const patients = await this.patientsService.getAllPatients();
            res.status(200).json(ApiResponse.success(patients));
        }
       
    }

    async getPatientById(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        const patient = await this.patientsService.getPatientById(id);
        if (patient) {
            res.status(200).json(ApiResponse.success(patient));
        } else {
            res.status(404).json(ApiResponse.error('Patient not found'));
        }
    }

    async createPatient(req: Request, res: Response): Promise<void> {
        const createPatientDTO: CreatePatientDTO = req.body;
        if ((req as any).user?.role.name === 'patient') {
            createPatientDTO.userId = (req as any).user?.userId;
        }
        console.log(createPatientDTO.userId);
        const patient = await this.patientsService.createPatient(createPatientDTO);
        res.status(201).json(ApiResponse.success(patient));
    }

    async updatePatient(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        const updatePatientDTO: UpdatePatientDTO = req.body;
        const patient = await this.patientsService.updatePatient(id, updatePatientDTO);
        if (patient) {
            res.status(200).json(ApiResponse.success(patient));
        } else {
            res.status(404).json(ApiResponse.error('Patient not found'));
        }
    }

    async deletePatient(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        await this.patientsService.deletePatient(id);
        res.status(200).json(ApiResponse.success(null, 'Patient deleted successfully'));
    }

    async findByCCCD(req: Request, res: Response): Promise<void> {
        const { cccd } = req.query;
        if (!cccd || typeof cccd !== 'string') {
            res.status(400).json(ApiResponse.error('CCCD is required'));
            return;
        }
        const patient = await this.patientsService.findByCCCD(cccd);
        if (patient) {
            res.status(200).json(ApiResponse.success(patient));
        } else {
            res.status(404).json(ApiResponse.error('Patient not found'));
        }
    }

    async findByPhoneNumber(req: Request, res: Response): Promise<void> {
        const { phoneNumber } = req.query;
        if (!phoneNumber || typeof phoneNumber !== 'string') {
            res.status(400).json(ApiResponse.error('Phone number is required'));
            return;
        }
        const patient = await this.patientsService.findByPhoneNumber(phoneNumber);
        if (patient) {
            res.status(200).json(ApiResponse.success(patient));
        } else {
            res.status(404).json(ApiResponse.error('Patient not found'));
        }
    }

    async findByEmail(req: Request, res: Response): Promise<void> {
        const { email } = req.query;
        if (!email || typeof email !== 'string') {
            res.status(400).json(ApiResponse.error('Email is required'));
            return;
        }
        const patient = await this.patientsService.findByEmail(email);
        if (patient) {
            res.status(200).json(ApiResponse.success(patient));
        } else {
            res.status(404).json(ApiResponse.error('Patient not found'));
        }
    }
} 