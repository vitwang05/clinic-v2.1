import { MedicinesRepository } from '../repositories/MedicineRepository';
import { Medicine } from '../orm/entities/Medicine';
import { BadRequestException, NotFoundException } from '../exceptions';
import { CreateMedicineDTO, UpdateMedicineDTO } from '../dtos/medicine/medicine.dto';

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

    async createMedicine(data: CreateMedicineDTO): Promise<Medicine> {
        const existing = await this.medicinesRepository.findOne({ name: data.name });
        if (existing) throw new BadRequestException('Medicine name already exists');

        if (data.stockQuantity === undefined) {
            data.stockQuantity = 0;
        }

        const medicine = this.medicinesRepository.create(data);

        return this.medicinesRepository.save(medicine);
    }

    async updateMedicine(id: number, data: UpdateMedicineDTO): Promise<Medicine> {
        const medicine = await this.getMedicineById(id);

        if (data.name && data.name !== medicine.name) {
            const existing = await this.medicinesRepository.findOne({ name: data.name });
            if (existing) throw new BadRequestException('Medicine name already exists');
        }

        return this.medicinesRepository.update(id,medicine);
    }

    async deleteMedicine(id: number): Promise<void> {
        const medicine = await this.getMedicineById(id);
        
        if (medicine.prescriptionDetails?.length > 0) {
            throw new BadRequestException('Cannot delete medicine that has prescription details');
        }
        
        if (medicine.inventoryTransactions?.length > 0) {
            throw new BadRequestException('Cannot delete medicine that has inventory transactions');
        }

        await this.medicinesRepository.delete(id);
    }

    async getMedicineStock(id: number): Promise<number> {
        const medicine = await this.getMedicineById(id);
        return medicine.stockQuantity;
    }

    async updateMedicineStock(id: number, quantity: number): Promise<Medicine> {
        const medicine = await this.getMedicineById(id);
        medicine.stockQuantity = quantity;
        return this.medicinesRepository.save(medicine);
    }
}
