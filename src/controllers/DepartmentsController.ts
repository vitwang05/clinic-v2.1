import { Request, Response } from 'express';
import { DepartmentsService } from '../services/DepartmentsService';
import { ApiResponse } from '../utils/ApiResponse';
import { CreateDepartmentDTO } from '../dtos/department/department.dto';
import { UpdateDepartmentDTO } from '../dtos/department/department.dto';

export class DepartmentsController {
    constructor(private departmentsService: DepartmentsService) {}

    async getAllDepartments(req: Request, res: Response): Promise<void> {
        const departments = await this.departmentsService.getAllDepartments();
        res.status(200).json(ApiResponse.success(departments));
    }

    async getDepartmentById(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        const department = await this.departmentsService.getDepartmentById(id);
        if (department) {
            res.status(200).json(ApiResponse.success(department));
        } else {
            res.status(404).json(ApiResponse.error('Department not found'));
        }
    }

    async createDepartment(req: Request, res: Response): Promise<void> {
        const createDepartmentDTO: CreateDepartmentDTO = req.body;
        const department = await this.departmentsService.createDepartment(createDepartmentDTO);
        res.status(201).json(ApiResponse.success(department));
    }

    async updateDepartment(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        const updateDepartmentDTO: UpdateDepartmentDTO = req.body;
        const department = await this.departmentsService.updateDepartment(id, updateDepartmentDTO);
        res.status(200).json(ApiResponse.success(department));
    }

    async deleteDepartment(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        await this.departmentsService.deleteDepartment(id);
        res.status(200).json(ApiResponse.success(null, 'Department deleted successfully'));
    }
} 