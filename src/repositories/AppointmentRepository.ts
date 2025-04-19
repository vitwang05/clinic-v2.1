import { DataSource } from 'typeorm';
import { Appointments } from '../orm/entities/Appointments';
import { CommonRepository } from './CommonRepository';

export class AppointmentsRepository extends CommonRepository<Appointments> {
    constructor(dataSource: DataSource) {
        super(Appointments, dataSource);
    }
} 