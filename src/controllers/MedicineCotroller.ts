import { Request, Response } from 'express';
import { MedicinesService } from '../services/MedicineService';
import { ApiResponse } from '../utils/ApiResponse';
import { CreateMedicineDTO, UpdateMedicineDTO } from '../dtos/medicine/medicine.dto';

export class MedicinesController {
    constructor(private medicinesService: MedicinesService) {}

    async getAllMedicines(req: Request, res: Response): Promise<void> {
        const medicines = await this.medicinesService.getAllMedicines();
        res.status(200).json(ApiResponse.success(medicines));
    }

    async getMedicineById(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        const medicine = await this.medicinesService.getMedicineById(id);
        res.status(200).json(ApiResponse.success(medicine));
    }

    async createMedicine(req: Request, res: Response): Promise<void> {
        const dto: CreateMedicineDTO = req.body;
        const medicine = await this.medicinesService.createMedicine(dto);
        res.status(201).json(ApiResponse.success(medicine));
    }

    async updateMedicine(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        const dto: UpdateMedicineDTO = req.body;
        const medicine = await this.medicinesService.updateMedicine(id, dto);
        res.status(200).json(ApiResponse.success(medicine));
    }

    async deleteMedicine(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        await this.medicinesService.deleteMedicine(id);
        res.status(200).json(ApiResponse.success(null, 'Medicine deleted successfully'));
    }
}
