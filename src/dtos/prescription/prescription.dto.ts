import { Type } from 'class-transformer';
import { IsString, IsOptional, IsNumber, IsNotEmpty, ValidateNested, IsArray } from 'class-validator';
import { CreatePrescriptionDetailDTO } from './prescriptionDetail.dto';
export class CreatePrescriptionDTO {
    @IsNumber()
    @IsNotEmpty({ message: 'Medical Record ID is required' })
    medicalRecordId: number;

    @IsNumber()
    @IsNotEmpty({ message: 'Doctor ID is required' })
    doctorId: number;

    @IsString()
    @IsOptional()
    notes?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreatePrescriptionDetailDTO)
    prescriptionDetails!: CreatePrescriptionDetailDTO[];
}

export class UpdatePrescriptionDTO {
    @IsNumber()
    @IsOptional()
    medicalRecordId?: number;

    @IsNumber()
    @IsOptional()
    doctorId?: number;

    @IsString()
    @IsOptional()
    notes?: string;

    @IsString()
    @IsOptional()
    total?: number;
} 