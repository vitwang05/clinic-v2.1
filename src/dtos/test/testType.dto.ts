import { IsString, IsNumber, IsNotEmpty, MinLength,IsOptional } from 'class-validator';

export class CreateTestTypeDTO {
    @IsString({ message: 'Tên loại xét nghiệm là bắt buộc' })
    @MinLength(2, { message: 'Tên loại xét nghiệm phải có ít nhất 2 ký tự' })
    name: string;

    @IsNumber({}, { message: 'Giá xét nghiệm phải là số' })
    @IsNotEmpty({ message: 'Giá xét nghiệm là bắt buộc' })
    price: number;
}

export class UpdateTestTypeDTO {
    @IsString()
    @IsOptional()
    @MinLength(2, { message: 'Tên loại xét nghiệm phải có ít nhất 2 ký tự' })
    name?: string;

    @IsNumber({}, { message: 'Giá xét nghiệm phải là số' })
    @IsOptional()
    price?: number;
}