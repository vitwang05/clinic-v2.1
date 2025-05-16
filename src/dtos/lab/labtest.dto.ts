import { IsString, IsOptional, IsNumber, IsNotEmpty, IsObject } from 'class-validator';
import { LabTestResult } from '../../orm/entities/Labtest';

export class CreateLabtestDTO {
    @IsNumber()
    @IsNotEmpty({ message: 'Medical Record ID is required' })
    medicalRecordId: number;

    @IsNumber()
    @IsNotEmpty({ message: 'Doctor ID is required' })
    doctorId: number;

    @IsNumber()
    @IsNotEmpty({ message: 'Test Type ID is required' })
    testTypeId: number;
}

export class UpdateLabtestDTO {
    @IsNumber()
    @IsOptional()
    medicalRecordId?: number;

    @IsNumber()
    @IsOptional()
    doctorId?: number;

    @IsNumber()
    @IsOptional()
    testTypeId?: number;

    @IsObject()
    @IsOptional()
    result?: LabTestResult;
}