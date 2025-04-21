import { MedicinesRepository } from '../repositories/MedicineRepository';
import { Medicine } from '../orm/entities/Medicine';
import { BadRequestException, NotFoundException } from '../exceptions';

export class MedicinesService {
    constructor(private medicinesRepository: MedicinesRepository) {}

    async getAllMedicines(): Promise<Medicine[]> {
        return this.medicinesRepository.findAll();
    }

    async getMedicineById(id: number): Promise<Medicine> {
        const medicine = await this.medicinesRepository.findOne(id);
        if (!medicine) throw new NotFoundException('Medicine not found');
        return medicine;
    }

    async createMedicine(data: Partial<Medicine>): Promise<Medicine> {
        const existing = await this.medicinesRepository.findOne({ medicineName: data.name } as any);
        if (existing) throw new BadRequestException('Medicine name already exists');
        return this.medicinesRepository.save(data as Medicine);
    }

    async updateMedicine(id: number, data: Partial<Medicine>): Promise<Medicine> {
        const medicine = await this.getMedicineById(id);
        if (data.name && data.name !== medicine.name) {
            const existing = await this.medicinesRepository.findOne({ medicineName: data.name } as any);
            if (existing) throw new BadRequestException('Medicine name already exists');
        }
        return this.medicinesRepository.update(id, data);
    }

    async deleteMedicine(id: number): Promise<void> {
        await this.getMedicineById(id);
        await this.medicinesRepository.delete(id);
    }
}
