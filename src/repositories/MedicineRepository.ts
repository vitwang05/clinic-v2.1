import { DataSource } from 'typeorm';
import { Medicine } from '../orm/entities/Medicine';
import { CommonRepository } from './CommonRepository';

export class MedicinesRepository extends CommonRepository<Medicine> {
    constructor(dataSource: DataSource) {
        super(Medicine, dataSource);
    }
}
