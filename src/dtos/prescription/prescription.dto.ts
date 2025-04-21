import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

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

    @IsString()
    @IsOptional()
    total?: string;
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
    total?: string;
} 