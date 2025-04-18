import { IsString, IsEmail, IsPhoneNumber, IsDateString, IsEnum, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export enum EmployeeStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    ON_LEAVE = 'on_leave'
}

export class CreateEmployeeDTO {
    @IsString({ message: 'Họ tên phải là chuỗi ký tự' })
    @IsNotEmpty({ message: 'Họ tên không được để trống' })
    fullName!: string;

    @IsPhoneNumber('VN', { message: 'Số điện thoại không hợp lệ' })
    @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
    phoneNumber!: string;

    @IsEmail({}, { message: 'Email không hợp lệ' })
    @IsNotEmpty({ message: 'Email không được để trống' })
    email!: string;

    @IsString({ message: 'Địa chỉ phải là chuỗi ký tự' })
    @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
    address!: string;

    @IsDateString({}, { message: 'Ngày vào làm không hợp lệ' })
    @IsNotEmpty({ message: 'Ngày vào làm không được để trống' })
    hireDate!: string;

    @IsEnum(EmployeeStatus, { message: 'Trạng thái không hợp lệ' })
    @IsNotEmpty({ message: 'Trạng thái không được để trống' })
    status!: EmployeeStatus;

    @IsNumber({}, { message: 'ID vị trí phải là số' })
    @IsNotEmpty({ message: 'ID vị trí không được để trống' })
    positionId!: number;

    @IsNumber({}, { message: 'ID người dùng phải là số' })
    @IsNotEmpty({ message: 'ID người dùng không được để trống' })
    userId!: number;
}

export class UpdateEmployeeDTO {
    @IsString({ message: 'Họ tên phải là chuỗi ký tự' })
    @IsOptional()
    fullName?: string;

    @IsPhoneNumber('VN', { message: 'Số điện thoại không hợp lệ' })
    @IsOptional()
    phoneNumber?: string;

    @IsEmail({}, { message: 'Email không hợp lệ' })
    @IsOptional()
    email?: string;

    @IsString({ message: 'Địa chỉ phải là chuỗi ký tự' })
    @IsOptional()
    address?: string;

    @IsDateString({}, { message: 'Ngày vào làm không hợp lệ' })
    @IsOptional()
    hireDate?: string;

    @IsEnum(EmployeeStatus, { message: 'Trạng thái không hợp lệ' })
    @IsOptional()
    status?: EmployeeStatus;

    @IsNumber({}, { message: 'ID vị trí phải là số' })
    @IsOptional()
    positionId?: number;

    @IsNumber({}, { message: 'ID người dùng phải là số' })
    @IsOptional()
    userId?: number;
} 