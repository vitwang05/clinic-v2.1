import { DataSource } from 'typeorm';
import { TestType } from '../orm/entities/TestType';
import { CommonRepository } from './CommonRepository';

export class TestTypeRepository extends CommonRepository<TestType> {
    constructor(dataSource: DataSource) {
        super(TestType, dataSource);
    }
} 