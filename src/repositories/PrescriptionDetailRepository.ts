import { DataSource } from 'typeorm';
import { PrescriptionDetail } from '../orm/entities/PrescriptionDetail';
import { CommonRepository } from './CommonRepository';

export class PrescriptionDetailRepository extends CommonRepository<PrescriptionDetail> {
    constructor(dataSource: DataSource) {
        super(PrescriptionDetail, dataSource);
    }
} 