import { IsNumber, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateMedicineDTO {
    @IsString({ message: 'Tên thuốc phải là chuỗi' })
    @IsNotEmpty({ message: 'Tên thuốc không được để trống' })
    name!: string;

    @IsString({ message: 'Đơn vị tính phải là chuỗi (vd: viên, chai, ống...)' })
    @IsNotEmpty({ message: 'Đơn vị tính không được để trống' })
    unit!: string;

    // @IsNumber({}, { message: 'Giá thuốc phải là số' })
    @IsNotEmpty({ message: 'Giá thuốc không được để trống' })
    price!: string;
}

export class UpdateMedicineDTO {
    @IsString({ message: 'Tên thuốc phải là chuỗi' })
    @IsOptional()
    name?: string;

    @IsString({ message: 'Đơn vị tính phải là chuỗi' })
    @IsOptional()
    unit?: string;

    // @IsNumber({}, { message: 'Giá thuốc phải là số' })
    @IsOptional()
    price?: string;
}
