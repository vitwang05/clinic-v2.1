import { DataSource } from 'typeorm';
import { Employees } from '../orm/entities/Employees';
import { CommonRepository } from './CommonRepository';

export class EmployeesRepository extends CommonRepository<Employees> {
    constructor(dataSource: DataSource) {
        super(Employees, dataSource);
    }
} 