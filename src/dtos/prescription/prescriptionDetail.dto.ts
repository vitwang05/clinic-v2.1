import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

export class CreatePrescriptionDetailDTO {
    @IsNumber()
    @IsNotEmpty({ message: 'Medicine ID is required' })
    medicineId: number;


    @IsString()
    @IsOptional()
    dosage?: string;

    @IsString()
    @IsOptional()
    frequency?: string;

    @IsString()
    @IsOptional()
    duration?: string;
}

export class UpdatePrescriptionDetailDTO {
    @IsNumber()
    @IsOptional()
    medicineId?: number;

    @IsNumber()
    @IsOptional()
    prescriptionId?: number;

    @IsString()
    @IsOptional()
    dosage?: string;

    @IsString()
    @IsOptional()
    frequency?: string;

    @IsString()
    @IsOptional()
    duration?: string;
}