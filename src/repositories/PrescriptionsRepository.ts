import { DataSource } from 'typeorm';
import { Prescriptions } from '../orm/entities/Prescriptions';
import { CommonRepository } from './CommonRepository';

export class PrescriptionsRepository extends CommonRepository<Prescriptions> {
    constructor(dataSource: DataSource) {
        super(Prescriptions, dataSource);
    }
}