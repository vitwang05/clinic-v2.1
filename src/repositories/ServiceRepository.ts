import { DataSource } from 'typeorm';
import { Services } from '../orm/entities/Services';
import { CommonRepository } from './CommonRepository';

export class ServiceRepository extends CommonRepository<Services> {
    constructor(dataSource: DataSource) {
        super(Services, dataSource);
    }
} 