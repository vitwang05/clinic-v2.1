import { Request, Response } from 'express';
import { PrescriptionsService } from '../services/PrescriptionsService';
import { ApiResponse } from '../utils/ApiResponse';
import { CreatePrescriptionDTO } from '../dtos/prescription/prescription.dto';
import { UpdatePrescriptionDTO } from '../dtos/prescription/prescription.dto';

export class PrescriptionsController {
    constructor(private prescriptionsService: PrescriptionsService) {}

    async getAllPrescriptions(req: Request, res: Response): Promise<void> {
        const prescriptions = await this.prescriptionsService.getAllPrescriptions();
        res.status(200).json(ApiResponse.success(prescriptions));
    }

    async getPrescriptionById(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        const prescription = await this.prescriptionsService.getPrescriptionById(id);
        res.status(200).json(ApiResponse.success(prescription));
    }

    async createPrescription(req: Request, res: Response): Promise<void> {
        console.log(req.body);
        const createPrescriptionDTO: CreatePrescriptionDTO = req.body;
        const prescription = await this.prescriptionsService.createPrescription(createPrescriptionDTO);
        res.status(201).json(ApiResponse.success(prescription));
    }

    async updatePrescription(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        const updatePrescriptionDTO: UpdatePrescriptionDTO = req.body;
        const prescription = await this.prescriptionsService.updatePrescription(id, updatePrescriptionDTO);
        res.status(200).json(ApiResponse.success(prescription));
    }

    async deletePrescription(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        await this.prescriptionsService.deletePrescription(id);
        res.status(200).json(ApiResponse.success(null, 'Prescription deleted successfully'));
    }
} 