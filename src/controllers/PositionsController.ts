import { Request, Response } from 'express';
import { PositionsService } from '../services/PositionsService';
import { ApiResponse } from '../utils/ApiResponse';
import { CreatePositionDTO } from '../dtos/position/position.dto';
import { UpdatePositionDTO } from '../dtos/position/position.dto';

export class PositionsController {
    constructor(private positionsService: PositionsService) {}

    async getAllPositions(req: Request, res: Response): Promise<void> {
        const positions = await this.positionsService.getAllPositions();
        res.status(200).json(ApiResponse.success(positions));
    }

    async getPositionById(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        const position = await this.positionsService.getPositionById(id);
        if (position) {
            res.status(200).json(ApiResponse.success(position));
        } else {
            res.status(404).json(ApiResponse.error('Position not found'));
        }
    }

    async createPosition(req: Request, res: Response): Promise<void> {
        const createPositionDTO: CreatePositionDTO = req.body;
        const position = await this.positionsService.createPosition(createPositionDTO);
        res.status(201).json(ApiResponse.success(position));
    }

    async updatePosition(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        const updatePositionDTO: UpdatePositionDTO = req.body;
        const position = await this.positionsService.updatePosition(id, updatePositionDTO);
        res.status(200).json(ApiResponse.success(position));
    }

    async deletePosition(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        await this.positionsService.deletePosition(id);
        res.status(200).json(ApiResponse.success(null, 'Position deleted successfully'));
    }
} 