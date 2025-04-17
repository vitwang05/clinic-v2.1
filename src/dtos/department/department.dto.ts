import { IsString, IsOptional, MinLength } from 'class-validator';

export class CreateDepartmentDTO {
    @IsString({ message: 'Tên phòng ban là bắt buộc' })
    @MinLength(2, { message: 'Tên phòng ban phải có ít nhất 2 ký tự' })
    departmentName: string;

    @IsString()
    @IsOptional()
    description?: string;
}

export class UpdateDepartmentDTO {
    @IsString()
    @IsOptional()
    @MinLength(2, { message: 'Tên phòng ban phải có ít nhất 2 ký tự' })
    departmentName?: string;

    @IsString()
    @IsOptional()
    description?: string;
} 