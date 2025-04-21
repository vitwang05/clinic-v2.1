import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateTransactionDTO {
    @IsNumber()
    @IsNotEmpty({ message: 'Prescription ID is required' })
    prescriptionId: number;

    @IsNumber()
    @IsNotEmpty({ message: 'User ID is required' })
    userId: number;

    @IsString()
    @IsNotEmpty({ message: 'Total money is required' })
    totalMoney: string;
}

export class UpdateTransactionDTO {
    @IsNumber()
    @IsOptional()
    prescriptionId?: number;

    @IsNumber()
    @IsOptional()
    userId?: number;

    @IsString()
    @IsOptional()
    totalMoney?: string;
} 