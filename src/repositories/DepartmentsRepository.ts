import { DataSource } from 'typeorm';
import { Departments } from '../orm/entities/Departments';
import { CommonRepository } from './CommonRepository';

export class DepartmentsRepository extends CommonRepository<Departments> {
    constructor(dataSource: DataSource) {
        super(Departments, dataSource);
    }
} 