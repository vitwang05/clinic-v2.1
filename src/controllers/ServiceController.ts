import { Request, Response } from 'express';
import { ServiceService } from '../services/ServiceService';
import { CreateServiceDTO } from '../dtos/service/service.dto';
import { UpdateServiceDTO } from '../dtos/service/service.dto';
import { ApiResponse } from '../utils/ApiResponse';

export class ServiceController {
    constructor(private serviceService: ServiceService) {}

    async createService(req: Request, res: Response): Promise<void> {
        try {
            const dto: CreateServiceDTO = req.body;
            const service = await this.serviceService.createService(dto);
            res.status(201).json(ApiResponse.success(service));
        } catch (error) {
            res.status(400).json(ApiResponse.error(error.message));
        }
    }

    async updateService(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            const dto: UpdateServiceDTO = req.body;
            const service = await this.serviceService.updateService(id, dto);
            
            if (!service) {
                res.status(404).json(ApiResponse.error('Dịch vụ không tồn tại'));
                return;
            }

            res.status(200).json(ApiResponse.success(service));
        } catch (error) {
            res.status(400).json(ApiResponse.error(error.message));
        }
    }

    async getServiceById(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            const service = await this.serviceService.getServiceById(id);
            
            if (!service) {
                res.status(404).json(ApiResponse.error('Dịch vụ không tồn tại'));
                return;
            }

            res.status(200).json(ApiResponse.success(service));
        } catch (error) {
            res.status(500).json(ApiResponse.error(error.message));
        }
    }

    async getAllServices(req: Request, res: Response): Promise<void> {
        try {
            const services = await this.serviceService.getAllServices();
            res.status(200).json(ApiResponse.success(services));
        } catch (error) {
            res.status(500).json(ApiResponse.error(error.message));
        }
    }

    async deleteService(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            const success = await this.serviceService.deleteService(id);
            
            if (!success) {
                res.status(404).json(ApiResponse.error('Dịch vụ không tồn tại'));
                return;
            }

            res.status(200).json(ApiResponse.success({ message: 'Xóa dịch vụ thành công' }));
        } catch (error) {
            res.status(500).json(ApiResponse.error(error.message));
        }
    }
} 