import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';
import { AtLeastOneField } from '../../utils/AtLeastOneField';

export class CreateTransactionDTO {
    @IsNumber()
    @IsOptional()
    prescriptionId: number;

    @IsNumber()
    @IsOptional()
    appointmentId: number;

    @IsNumber()
    @IsOptional()
    userId: number;

    @IsNumber()
    @IsOptional()
    totalMoney?: number;
    @AtLeastOneField(['prescriptionId', 'appointmentId'], {
        message: 'At least one of prescriptionId or appointmentId must be provided',
      })
      dummyValidationTrigger: any;
}

export class UpdateTransactionDTO {
    @IsNumber()
    @IsOptional()
    prescriptionId?: number;

    @IsNumber()
    @IsOptional()
    userId?: number;

    @IsNumber()
    @IsOptional()
    totalMoney?: number;
} 