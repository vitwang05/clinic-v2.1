import { DataSource } from 'typeorm';
import { Transactions } from '../orm/entities/Transactions';
import { CommonRepository } from './CommonRepository';

export class TransactionsRepository extends CommonRepository<Transactions> {
    constructor(dataSource: DataSource) {
        super(Transactions, dataSource);
    }
} 