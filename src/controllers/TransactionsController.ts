import { Request, Response } from 'express';
import { TransactionsService } from '../services/TransactionsService';
import { ApiResponse } from '../utils/ApiResponse';
import { CreateTransactionDTO } from '../dtos/transaction/transaction.dto';
import { UpdateTransactionDTO } from '../dtos/transaction/transaction.dto';

export class TransactionsController {
    constructor(private transactionsService: TransactionsService) {}

    async getAllTransactions(req: Request, res: Response): Promise<void> {
        const transactions = await this.transactionsService.getAllTransactions();
        res.status(200).json(ApiResponse.success(transactions));
    }

    async getTransactionById(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        const transaction = await this.transactionsService.getTransactionById(id);
        res.status(200).json(ApiResponse.success(transaction));
    }

    async createTransaction(req: Request, res: Response): Promise<void> {
        const createTransactionDTO: CreateTransactionDTO = req.body;
        const transaction = await this.transactionsService.createTransaction(createTransactionDTO);
        res.status(201).json(ApiResponse.success(transaction));
    }

    async updateTransaction(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        const updateTransactionDTO: UpdateTransactionDTO = req.body;
        const transaction = await this.transactionsService.updateTransaction(id, updateTransactionDTO);
        res.status(200).json(ApiResponse.success(transaction));
    }

    async deleteTransaction(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        await this.transactionsService.deleteTransaction(id);
        res.status(200).json(ApiResponse.success(null, 'Transaction deleted successfully'));
    }
}