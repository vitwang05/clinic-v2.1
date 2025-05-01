import { IsString, IsNumber, IsBoolean, IsOptional, IsNotEmpty, Min } from 'class-validator';

export class CreateServiceDTO {
    @IsString()
    @IsNotEmpty({ message: 'Tên dịch vụ không được để trống' })
    name!: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @Min(0, { message: 'Giá dịch vụ phải lớn hơn hoặc bằng 0' })
    @IsNotEmpty({ message: 'Giá dịch vụ không được để trống' })
    price!: number;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}

export class UpdateServiceDTO {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @Min(0, { message: 'Giá dịch vụ phải lớn hơn hoặc bằng 0' })
    @IsOptional()
    price?: number;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
} 