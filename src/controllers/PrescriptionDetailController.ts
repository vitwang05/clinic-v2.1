import { Request, Response } from 'express';
import { PrescriptionDetailService } from '../services/PrescriptionDetailService';
import { ApiResponse } from '../utils/ApiResponse';
import { CreatePrescriptionDetailDTO } from '../dtos/prescription/prescriptionDetail.dto';
import { UpdatePrescriptionDetailDTO } from '../dtos/prescription/prescriptionDetail.dto';

export class PrescriptionDetailController {
    constructor(private prescriptionDetailService: PrescriptionDetailService) {}

    async getAllPrescriptionDetails(req: Request, res: Response): Promise<void> {
        const prescriptionDetails = await this.prescriptionDetailService.getAllPrescriptionDetails();
        res.status(200).json(ApiResponse.success(prescriptionDetails));
    }

    async getPrescriptionDetailById(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        const prescriptionDetail = await this.prescriptionDetailService.getPrescriptionDetailById(id);
        res.status(200).json(ApiResponse.success(prescriptionDetail));
    }

    async createPrescriptionDetail(req: Request, res: Response): Promise<void> {
        const createPrescriptionDetailDTO: CreatePrescriptionDetailDTO = req.body;
        const prescriptionDetail = await this.prescriptionDetailService.createPrescriptionDetail(createPrescriptionDetailDTO);
        res.status(201).json(ApiResponse.success(prescriptionDetail));
    }

    async updatePrescriptionDetail(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        const updatePrescriptionDetailDTO: UpdatePrescriptionDetailDTO = req.body;
        const prescriptionDetail = await this.prescriptionDetailService.updatePrescriptionDetail(id, updatePrescriptionDetailDTO);
        res.status(200).json(ApiResponse.success(prescriptionDetail));
    }

    async deletePrescriptionDetail(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        await this.prescriptionDetailService.deletePrescriptionDetail(id);
        res.status(200).json(ApiResponse.success(null, 'Prescription detail deleted successfully'));
    }
} 