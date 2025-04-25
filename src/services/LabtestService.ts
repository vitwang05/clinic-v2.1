import { LabtestRepository } from '../repositories/LabtestRepository';
import { Labtest } from '../orm/entities/Labtest';
import { BadRequestException, NotFoundException } from '../exceptions';

export class LabtestService {
    private labtestRepository: LabtestRepository;

    constructor(labtestRepository: LabtestRepository) {
        this.labtestRepository = labtestRepository;
    }

    async getAllLabtests(): Promise<Labtest[]> {
        return this.labtestRepository.findAll();
    }


    async getLabtestsByPatientId(patientId: number): Promise<Labtest[]> {

       return;
    }

    async getLabtestById(id: number): Promise<Labtest> {
        const labtest = await this.labtestRepository.findOne(id);
        if (!labtest) {
            throw new NotFoundException('Lab test not found');``
        }
        return labtest;
    }

    async createLabtest(labtestData: Partial<Labtest>): Promise<Labtest> {
        return this.labtestRepository.save(labtestData as Labtest);
    }

    async updateLabtest(id: number, labtestData: Partial<Labtest>): Promise<Labtest> {
        const labtest = await this.getLabtestById(id);
        return this.labtestRepository.update(id, labtestData);
    }

    async deleteLabtest(id: number): Promise<void> {
        const labtest = await this.getLabtestById(id);
        await this.labtestRepository.delete(id);
    }
} 