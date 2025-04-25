import { InventoryTransactionRepository } from '../repositories/InventoryTransactionRepository';
import { MedicinesRepository } from '../repositories/MedicineRepository';
import { InventoryTransaction } from '../orm/entities/InventoryTransaction';
import { BadRequestException, NotFoundException } from '../exceptions';
import { CreateInventoryTransactionDTO} from '../dtos/inventory/inventory-transaction.dto';
export class InventoryTransactionService {
    constructor(
        private inventoryTransactionRepository: InventoryTransactionRepository,
        private medicinesRepository: MedicinesRepository
    ) {}

    async getAllTransactions(): Promise<InventoryTransaction[]> {
        return this.inventoryTransactionRepository.findAll();
    }

    async getTransactionById(id: number): Promise<InventoryTransaction> {
        const transaction = await this.inventoryTransactionRepository.findOne(id);
        if (!transaction) throw new NotFoundException('Transaction not found');
        return transaction;
    }

    async createTransaction(data: CreateInventoryTransactionDTO): Promise<InventoryTransaction> {
        const medicine = await this.medicinesRepository.findOne(data.medicineId);
        if (!medicine) throw new NotFoundException('Medicine not found');

        // Update medicine stock quantity
        if (data.type === 'import') {
            medicine.stockQuantity += data.quantity as number;
        } else if (data.type === 'export') {
            if (medicine.stockQuantity < (data.quantity as number)) {
                throw new BadRequestException('Insufficient stock quantity');
            }
            medicine.stockQuantity -= data.quantity as number;
        }

        await this.medicinesRepository.save(medicine);
        const transaction = this.inventoryTransactionRepository.create(data);
        return this.inventoryTransactionRepository.save(transaction);
    }

    async deleteTransaction(id: number): Promise<void> {
        const transaction = await this.getTransactionById(id);
        const medicine = await this.medicinesRepository.findOne(transaction.medicine.id);
        
        if (!medicine) throw new NotFoundException('Medicine not found');

        // Reverse the stock quantity change
        if (transaction.type === 'import') {
            medicine.stockQuantity -= transaction.quantity;
        } else if (transaction.type === 'export') {
            medicine.stockQuantity += transaction.quantity;
        }

        await this.medicinesRepository.update(medicine.id,medicine);
        await this.inventoryTransactionRepository.delete(id);
    }

    
} 