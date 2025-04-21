import { DataSource } from 'typeorm';
import { Labtest } from '../orm/entities/Labtest';
import { CommonRepository } from './CommonRepository';

export class LabtestRepository extends CommonRepository<Labtest> {
    constructor(dataSource: DataSource) {
        super(Labtest, dataSource);
    }
}