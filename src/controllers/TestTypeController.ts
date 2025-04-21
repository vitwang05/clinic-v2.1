import { Request, Response } from 'express';
import { TestTypeService } from '../services/TestTypeService';
import { ApiResponse } from '../utils/ApiResponse';
import { CreateTestTypeDTO } from '../dtos/test/testType.dto';
import { UpdateTestTypeDTO } from '../dtos/test/testType.dto';

export class TestTypeController {
    constructor(private testTypeService: TestTypeService) {}

    async getAllTestTypes(req: Request, res: Response): Promise<void> {
        const testTypes = await this.testTypeService.getAllTestTypes();
        res.status(200).json(ApiResponse.success(testTypes));
    }

    async getTestTypeById(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        const testType = await this.testTypeService.getTestTypeById(id);
        res.status(200).json(ApiResponse.success(testType));
    }

    async createTestType(req: Request, res: Response): Promise<void> {
        const createTestTypeDTO: CreateTestTypeDTO = req.body;
        const testType = await this.testTypeService.createTestType(createTestTypeDTO);
        res.status(201).json(ApiResponse.success(testType));
    }

    async updateTestType(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        const updateTestTypeDTO: UpdateTestTypeDTO = req.body;
        const testType = await this.testTypeService.updateTestType(id, updateTestTypeDTO);
        res.status(200).json(ApiResponse.success(testType));
    }

    async deleteTestType(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        await this.testTypeService.deleteTestType(id);
        res.status(200).json(ApiResponse.success(null, 'Test type deleted successfully'));
    }
} 