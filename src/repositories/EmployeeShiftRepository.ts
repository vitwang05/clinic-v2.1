import { DataSource, Repository } from 'typeorm';
import { EmployeeShift } from '../orm/entities/EmployeeShift';

export class EmployeeShiftRepository extends Repository<EmployeeShift> {
    constructor(dataSource: DataSource) {
        super(EmployeeShift, dataSource.createEntityManager());
    }
} 