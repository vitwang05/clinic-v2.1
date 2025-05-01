import { DataSource } from "typeorm";
import { Services } from "../orm/entities/Services";
import { CreateServiceDTO, UpdateServiceDTO } from "../dtos/service/service.dto";
import { ServiceRepository } from "../repositories/ServiceRepository";

export class ServiceService {
    constructor(private serviceRepository: ServiceRepository) {}

    async createService(dto: CreateServiceDTO): Promise<Services> {
        const repo = this.serviceRepository;
   
        const service = repo.create(dto);
     
        return repo.save(service);
    }

    async updateService(id: number, dto: UpdateServiceDTO): Promise<Services | null> {
        const repo = this.serviceRepository;
        const service = await repo.findOne(id);

        if (!service) return null;

        if (dto.name !== undefined) service.name = dto.name;
        if (dto.description !== undefined) service.description = dto.description;
        if (dto.price !== undefined) service.price = dto.price;
        if (dto.isActive !== undefined) service.isActive = dto.isActive;

        return repo.save(service);
    }

    async getServiceById(id: number): Promise<Services | null> {
        const repo = this.serviceRepository;
        return repo.findOne(id);
    }

    async getAllServices(): Promise<Services[]> {
        const repo = this.serviceRepository;
        return repo.findWithCondition({
            isActive: true 
        });
    }

    async deleteService(id: number): Promise<boolean> {
        const repo = this.serviceRepository;
        const service = await repo.findOne(id);
        
        if (!service) return false;

        service.isActive = false;
        await repo.save(service);
        return true;
    }
} 