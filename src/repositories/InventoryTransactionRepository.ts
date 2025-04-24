import { DataSource } from 'typeorm';
import { InventoryTransaction } from '../orm/entities/InventoryTransaction';
import { CommonRepository } from './CommonRepository';

export class InventoryTransactionRepository extends CommonRepository<InventoryTransaction> {
    constructor(dataSource: DataSource) {
        super(InventoryTransaction, dataSource);
    }

  
} 