import { Request, Response } from 'express';
import { ShiftsService } from '../services/ShiftsService';
import { ApiResponse } from '../utils/ApiResponse';
import { CreateShiftDTO } from '../dtos/shift/shift.dto';
import { UpdateShiftDTO } from '../dtos/shift/shift.dto';

export class ShiftsController {
    constructor(private shiftsService: ShiftsService) {}

    async getAllShifts(req: Request, res: Response): Promise<void> {
        const shifts = await this.shiftsService.getAllShifts();
        res.status(200).json(ApiResponse.success(shifts));
    }

    async getShiftById(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        const shift = await this.shiftsService.getShiftById(id);
        if (shift) {
            res.status(200).json(ApiResponse.success(shift));
        } else {
            res.status(404).json(ApiResponse.error('Shift not found'));
        }
    }

    async createShift(req: Request, res: Response): Promise<void> {
        const createShiftDTO: CreateShiftDTO = req.body;
        const shift = await this.shiftsService.createShift(createShiftDTO);
        res.status(201).json(ApiResponse.success(shift));
    }

    async updateShift(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        const updateShiftDTO: UpdateShiftDTO = req.body;
        const shift = await this.shiftsService.updateShift(id, updateShiftDTO);
        if (shift) {
            res.status(200).json(ApiResponse.success(shift));
        } else {
            res.status(404).json(ApiResponse.error('Shift not found'));
        }
    }

    async deleteShift(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        const success = await this.shiftsService.deleteShift(id);
        if (success) {
            res.status(200).json(ApiResponse.success(null, 'Shift deleted successfully'));
        } else {
            res.status(404).json(ApiResponse.error('Shift not found'));
        }
    }
} 