import { Request, Response } from 'express';
import { EmployeeShiftService } from '../services/EmployeeShiftService';
import { ApiResponse } from '../utils/ApiResponse';
import { CreateEmployeeShiftDTO } from '../dtos/employee-shift/employee-shift.dto';
import { UpdateEmployeeShiftDTO } from '../dtos/employee-shift/employee-shift.dto';

export class EmployeeShiftController {
    private employeeShiftService: EmployeeShiftService;

    constructor(employeeShiftService: EmployeeShiftService) {
        this.employeeShiftService = employeeShiftService;
    }

    async getAllEmployeeShifts(req: Request, res: Response): Promise<void> {
        const employeeShifts = await this.employeeShiftService.getAllEmployeeShifts();
        res.status(200).json(ApiResponse.success(employeeShifts));
    }

    async getEmployeeShiftById(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        const employeeShift = await this.employeeShiftService.getEmployeeShiftById(id);
        if (employeeShift) {
            res.status(200).json(ApiResponse.success(employeeShift));
        } else {
            res.status(404).json(ApiResponse.error('Employee shift not found'));
        }
    }

    async getEmployeeShiftsByEmployeeId(req: Request, res: Response): Promise<void> {
        const employeeId = parseInt(req.params.employeeId, 10);
        const employeeShifts = await this.employeeShiftService.getEmployeeShiftsByEmployeeId(employeeId);
        res.status(200).json(ApiResponse.success(employeeShifts));
    }

    async getEmployeeShiftsByShiftId(req: Request, res: Response): Promise<void> {
        const shiftId = parseInt(req.params.shiftId, 10);
        const employeeShifts = await this.employeeShiftService.getEmployeeShiftsByShiftId(shiftId);
        res.status(200).json(ApiResponse.success(employeeShifts));
    }

    async getEmployeeShiftsByDate(req: Request, res: Response): Promise<void> {
        const { date } = req.params;
        const employeeShifts = await this.employeeShiftService.getEmployeeShiftsByDate(date);
        res.status(200).json(ApiResponse.success(employeeShifts));
    }

    async getEmployeeShiftsByWeek(req: Request, res: Response): Promise<void> {
        const { date } = req.params;
        const employeeShifts = await this.employeeShiftService.getEmployeeShiftsByWeek(date);
        res.status(200).json(ApiResponse.success(employeeShifts));
    }

    async getEmployeeShiftsByEmployeeIdAndWeek(req: Request, res: Response): Promise<void> {
        const employeeId = parseInt(req.params.employeeId, 10);
        const { date } = req.params;
        const employeeShifts = await this.employeeShiftService.getEmployeeShiftsByEmployeeIdAndWeek(employeeId, date);
        res.status(200).json(ApiResponse.success(employeeShifts));
    }

    async createEmployeeShift(req: Request, res: Response): Promise<void> {
        const employeeShiftDTO: CreateEmployeeShiftDTO = req.body;
        try {
            const employeeShift = await this.employeeShiftService.createEmployeeShift(employeeShiftDTO);
            res.status(201).json(ApiResponse.success(employeeShift));
        } catch (error) {
            res.status(400).json(ApiResponse.error(error.message));
        }
    }

    async updateEmployeeShift(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        const employeeShiftDTO: UpdateEmployeeShiftDTO = req.body;
        try {
            const employeeShift = await this.employeeShiftService.updateEmployeeShift(id, employeeShiftDTO);
            if (employeeShift) {
                res.status(200).json(ApiResponse.success(employeeShift));
            } else {
                res.status(404).json(ApiResponse.error('Employee shift not found'));
            }
        } catch (error) {
            res.status(400).json(ApiResponse.error(error.message));
        }
    }

    async deleteEmployeeShift(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        const success = await this.employeeShiftService.deleteEmployeeShift(id);
        if (success) {
            res.status(200).json(ApiResponse.success(null, 'Employee shift deleted successfully'));
        } else {
            res.status(404).json(ApiResponse.error('Employee shift not found'));
        }
    }
} 