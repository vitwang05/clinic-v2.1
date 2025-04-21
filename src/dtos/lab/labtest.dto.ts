import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

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

    @IsString()
    @IsOptional()
    result?: string;
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

    @IsString()
    @IsOptional()
    result?: string;
}