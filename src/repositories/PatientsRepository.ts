import { DataSource } from 'typeorm';
import { Patients } from '../orm/entities/Patients';
import { CommonRepository } from './CommonRepository';

export class PatientsRepository extends CommonRepository<Patients> {
    constructor(dataSource: DataSource) {
        super(Patients, dataSource);
    }
} 