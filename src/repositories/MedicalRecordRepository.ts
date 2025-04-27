import { DataSource } from 'typeorm';
import { MedicalRecord } from '../orm/entities/MedicalRecord';
import { CommonRepository } from './CommonRepository';

export class MedicalRecordRepository extends CommonRepository<MedicalRecord> {
    constructor(dataSource: DataSource) {
        super(MedicalRecord, dataSource);
    }
} 