import { PrescriptionsRepository } from '../repositories/PrescriptionsRepository';
import { Prescriptions } from '../orm/entities/Prescriptions';
import { BadRequestException, NotFoundException } from '../exceptions';

export class PrescriptionsService {
    private prescriptionsRepository: PrescriptionsRepository;

    constructor(prescriptionsRepository: PrescriptionsRepository) {
        this.prescriptionsRepository = prescriptionsRepository;
    }

    async getAllPrescriptions(): Promise<Prescriptions[]> {
        return this.prescriptionsRepository.findAll();
    }

    async getPrescriptionById(id: number): Promise<Prescriptions> {
        const prescription = await this.prescriptionsRepository.findOne(id);
        if (!prescription) {
            throw new NotFoundException('Prescription not found');
        }
        return prescription;
    }

    async createPrescription(prescriptionData: Partial<Prescriptions>): Promise<Prescriptions> {
        return this.prescriptionsRepository.save(prescriptionData as Prescriptions);
    }

    async updatePrescription(id: number, prescriptionData: Partial<Prescriptions>): Promise<Prescriptions> {
        const prescription = await this.getPrescriptionById(id);
        return this.prescriptionsRepository.update(id, prescriptionData);
    }

    async deletePrescription(id: number): Promise<void> {
        const prescription = await this.getPrescriptionById(id);
        await this.prescriptionsRepository.delete(id);
    }
}