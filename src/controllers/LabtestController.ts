import { Request, Response } from 'express';
import { LabtestService } from '../services/LabtestService';
import { ApiResponse } from '../utils/ApiResponse';
import { CreateLabtestDTO } from '../dtos/lab/labtest.dto';
import { UpdateLabtestDTO } from '../dtos/lab/labtest.dto';

export class LabtestController {
    constructor(private labtestService: LabtestService) {}

    async getAllLabtests(req: Request, res: Response): Promise<void> {
        if((req as any).user?.role.name === 'patient'){
            // const labtests = await this.labtestService.getLabtestsByPatientId((req as any).user?.userId);
            // res.status(200).json(ApiResponse.success(labtests));
        }else{
            const labtests = await this.labtestService.getAllLabtests();
            res.status(200).json(ApiResponse.success(labtests));
        }
    }

    async getLabtestById(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        const labtest = await this.labtestService.getLabtestById(id);
        res.status(200).json(ApiResponse.success(labtest));
    }

    async createLabtest(req: Request, res: Response): Promise<void> {
        const createLabtestDTO: CreateLabtestDTO = req.body;
        const labtest = await this.labtestService.createLabtest(createLabtestDTO);
        res.status(201).json(ApiResponse.success(labtest));
    }

    async updateLabtest(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        const updateLabtestDTO: UpdateLabtestDTO = req.body;
        const labtest = await this.labtestService.updateLabtest(id, updateLabtestDTO);
        res.status(200).json(ApiResponse.success(labtest));
    }

    async deleteLabtest(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        await this.labtestService.deleteLabtest(id);
        res.status(200).json(ApiResponse.success(null, 'Lab test deleted successfully'));
    }
}