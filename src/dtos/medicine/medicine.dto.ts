import { IsNumber, IsNotEmpty, IsString, IsOptional, Min } from 'class-validator';

export class CreateMedicineDTO {
    @IsString({ message: 'Tên thuốc phải là chuỗi' })
    @IsNotEmpty({ message: 'Tên thuốc không được để trống' })
    name!: string;

    @IsString({ message: 'Đơn vị tính phải là chuỗi (vd: viên, chai, ống...)' })
    @IsNotEmpty({ message: 'Đơn vị tính không được để trống' })
    unit!: string;

    @IsNumber({}, { message: 'Giá thuốc phải là số' })
    @Min(0, { message: 'Giá thuốc không được âm' })
    @IsNotEmpty({ message: 'Giá thuốc không được để trống' })
    price!: number;

    @IsNumber({}, { message: 'Số lượng tồn kho phải là số' })
    @Min(0, { message: 'Số lượng tồn kho không được âm' })
    @IsOptional()
    stockQuantity?: number;
}

export class UpdateMedicineDTO {
    @IsString({ message: 'Tên thuốc phải là chuỗi' })
    @IsOptional()
    name?: string;

    @IsString({ message: 'Đơn vị tính phải là chuỗi' })
    @IsOptional()
    unit?: string;

    @IsNumber({}, { message: 'Giá thuốc phải là số' })
    @Min(0, { message: 'Giá thuốc không được âm' })
    @IsOptional()
    price?: number;

    @IsNumber({}, { message: 'Số lượng tồn kho phải là số' })
    @Min(0, { message: 'Số lượng tồn kho không được âm' })
    @IsOptional()
    stockQuantity?: number;
}
