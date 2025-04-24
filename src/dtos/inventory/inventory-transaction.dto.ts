import { IsEnum, IsInt, IsNotEmpty, Min } from 'class-validator';
import { InventoryTransactionType } from '../../orm/entities/InventoryTransaction';

export class CreateInventoryTransactionDTO {
    @IsEnum(['import', 'export'], { message: 'Loại giao dịch phải là import hoặc export' })
    @IsNotEmpty({ message: 'Loại giao dịch không được để trống' })
    type!: InventoryTransactionType;

    @IsInt({ message: 'Số lượng phải là số nguyên' })
    @Min(1, { message: 'Số lượng phải lớn hơn 0' })
    @IsNotEmpty({ message: 'Số lượng không được để trống' })
    quantity!: number;

    @IsInt({ message: 'ID thuốc phải là số nguyên' })
    @IsNotEmpty({ message: 'ID thuốc không được để trống' })
    medicineId!: number;
} 