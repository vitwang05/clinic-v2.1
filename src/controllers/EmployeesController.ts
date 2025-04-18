import { Request, Response } from 'express';
import { EmployeesService } from '../services/EmployeesService';
import { ApiResponse } from '../utils/ApiResponse';
import { CreateEmployeeDTO } from '../dtos/employee/employee.dto';
import { UpdateEmployeeDTO } from '../dtos/employee/employee.dto';

export class EmployeesController {
    constructor(private employeesService: EmployeesService) {}

    async getAllEmployees(req: Request, res: Response): Promise<void> {
        const employees = await this.employeesService.getAllEmployees();
        res.status(200).json(ApiResponse.success(employees));
    }

    async getEmployeeById(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        const employee = await this.employeesService.getEmployeeById(id);
        if (employee) {
            res.status(200).json(ApiResponse.success(employee));
        } else {
            res.status(404).json(ApiResponse.error('Employee not found'));
        }
    }

    async createEmployee(req: Request, res: Response): Promise<void> {
        const createEmployeeDTO: CreateEmployeeDTO = req.body;
        const employee = await this.employeesService.createEmployee(createEmployeeDTO);
        res.status(201).json(ApiResponse.success(employee));
    }

    async updateEmployee(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        const updateEmployeeDTO: UpdateEmployeeDTO = req.body;
        const employee = await this.employeesService.updateEmployee(id, updateEmployeeDTO);
        res.status(200).json(ApiResponse.success(employee));
    }

    async deleteEmployee(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        await this.employeesService.deleteEmployee(id);
        res.status(200).json(ApiResponse.success(null, 'Employee deleted successfully'));
    }
} 