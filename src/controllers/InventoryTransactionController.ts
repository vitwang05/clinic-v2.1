import { Request, Response } from 'express';
import { InventoryTransactionService } from '../services/InventoryTransactionService';
import { ApiResponse } from '../utils/ApiResponse';
import { CreateInventoryTransactionDTO } from '../dtos/inventory/inventory-transaction.dto';

export class InventoryTransactionController {
    constructor(private inventoryTransactionService: InventoryTransactionService) {}

    async getAllTransactions(req: Request, res: Response): Promise<void> {
        const transactions = await this.inventoryTransactionService.getAllTransactions();
        res.status(200).json(ApiResponse.success(transactions));
    }

    async getTransactionById(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        const transaction = await this.inventoryTransactionService.getTransactionById(id);
        res.status(200).json(ApiResponse.success(transaction));
    }

    async createTransaction(req: Request, res: Response): Promise<void> {
        const dto: CreateInventoryTransactionDTO = req.body;
        const transaction = await this.inventoryTransactionService.createTransaction(dto);
        res.status(201).json(ApiResponse.success(transaction));
    }

    async deleteTransaction(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        await this.inventoryTransactionService.deleteTransaction(id);
        res.status(200).json(ApiResponse.success(null, 'Transaction deleted successfully'));
    }
} 