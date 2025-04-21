import { TransactionsRepository } from '../repositories/TransactionsRepository';
import { Transactions } from '../orm/entities/Transactions';
import { BadRequestException, NotFoundException } from '../exceptions';

export class TransactionsService {
    private transactionsRepository: TransactionsRepository;

    constructor(transactionsRepository: TransactionsRepository) {
        this.transactionsRepository = transactionsRepository;
    }

    async getAllTransactions(): Promise<Transactions[]> {
        return this.transactionsRepository.findAll();
    }

    async getTransactionById(id: number): Promise<Transactions> {
        const transaction = await this.transactionsRepository.findOne(id);
        if (!transaction) {
            throw new NotFoundException('Transaction not found');
        }
        return transaction;
    }

    async createTransaction(transactionData: Partial<Transactions>): Promise<Transactions> {
        return this.transactionsRepository.save(transactionData as Transactions);
    }

    async updateTransaction(id: number, transactionData: Partial<Transactions>): Promise<Transactions> {
        const transaction = await this.getTransactionById(id);
        return this.transactionsRepository.update(id, transactionData);
    }

    async deleteTransaction(id: number): Promise<void> {
        const transaction = await this.getTransactionById(id);
        await this.transactionsRepository.delete(id);
    }
}