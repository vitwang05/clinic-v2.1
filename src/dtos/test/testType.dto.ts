import { IsString, IsNumber, IsNotEmpty, MinLength,IsOptional } from 'class-validator';

export class CreateTestTypeDTO {
    @IsString({ message: 'Tên loại xét nghiệm là bắt buộc' })
    @MinLength(2, { message: 'Tên loại xét nghiệm phải có ít nhất 2 ký tự' })
    name: string;

    // @IsNumber()
    @IsNotEmpty({ message: 'Giá xét nghiệm là bắt buộc' })
    price: string;
}

export class UpdateTestTypeDTO {
    @IsString()
    @IsOptional()
    @MinLength(2, { message: 'Tên loại xét nghiệm phải có ít nhất 2 ký tự' })
    name?: string;

    // @IsNumber()
    @IsOptional()
    price?: string;
}