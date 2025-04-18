import { DataSource } from 'typeorm';
import { Shifts } from '../orm/entities/Shifts';
import { CommonRepository } from './CommonRepository';

export class ShiftsRepository extends CommonRepository<Shifts> {
    constructor(dataSource: DataSource) {
        super(Shifts, dataSource);
    }
} 