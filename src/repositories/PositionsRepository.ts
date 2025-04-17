import { DataSource } from 'typeorm';
import { Positions } from '../orm/entities/Positions';
import { CommonRepository } from './CommonRepository';

export class PositionsRepository extends CommonRepository<Positions> {
    constructor(dataSource: DataSource) {
        super(Positions, dataSource);
    }
} 