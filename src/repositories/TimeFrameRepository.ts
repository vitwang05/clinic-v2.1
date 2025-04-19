import { DataSource } from 'typeorm';
import { CommonRepository } from './CommonRepository';
import { TimeFrame } from '../orm/entities/TimeFrame';

export class TimeFrameRepository extends CommonRepository<TimeFrame> {
    constructor(dataSource: DataSource) {
        super(TimeFrame, dataSource);
    }
} 