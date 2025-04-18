import { IsString, IsEmail, IsPhoneNumber, IsDateString, IsEnum, IsNumber, IsNotEmpty, IsOptional, MinLength, MaxLength } from 'class-validator';

export enum Gender {
    M = 'M',
    F = 'F',
    O = 'O'
}

export class CreatePatientDTO {
    @IsString({ message: 'Họ tên phải là chuỗi ký tự' })
    @IsNotEmpty({ message: 'Họ tên không được để trống' })
    fullName!: string;

    @IsDateString({}, { message: 'Ngày sinh không hợp lệ' })
    @IsNotEmpty({ message: 'Ngày sinh không được để trống' })
    dob!: string;

    @IsEnum(Gender, { message: 'Giới tính không hợp lệ' })
    @IsNotEmpty({ message: 'Giới tính không được để trống' })
    gender!: Gender;

    @IsPhoneNumber('VN', { message: 'Số điện thoại không hợp lệ' })
    @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
    phoneNumber!: string;

    @IsEmail({}, { message: 'Email không hợp lệ' })
    @IsOptional()
    email?: string;

    @IsString({ message: 'CCCD phải là chuỗi ký tự' })
    @MinLength(12, { message: 'CCCD phải có 12 ký tự' })
    @MaxLength(12, { message: 'CCCD phải có 12 ký tự' })
    @IsNotEmpty({ message: 'CCCD không được để trống' })
    cccd!: string;

    @IsString({ message: 'Địa chỉ phải là chuỗi ký tự' })
    @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
    address!: string;

    @IsString({ message: 'Nghề nghiệp phải là chuỗi ký tự' })
    @IsOptional()
    job?: string;

    @IsString({ message: 'Mối quan hệ phải là chuỗi ký tự' })
    @IsOptional()
    relationshipWithUser?: string;

    @IsNumber({}, { message: 'ID người dùng phải là số' })
    @IsNotEmpty({ message: 'ID người dùng không được để trống' })
    userId!: number;
}

export class UpdatePatientDTO {
    @IsString({ message: 'Họ tên phải là chuỗi ký tự' })
    @IsOptional()
    fullName?: string;

    @IsDateString({}, { message: 'Ngày sinh không hợp lệ' })
    @IsOptional()
    dob?: string;

    @IsEnum(Gender, { message: 'Giới tính không hợp lệ' })
    @IsOptional()
    gender?: Gender;

    @IsPhoneNumber('VN', { message: 'Số điện thoại không hợp lệ' })
    @IsOptional()
    phoneNumber?: string;

    @IsEmail({}, { message: 'Email không hợp lệ' })
    @IsOptional()
    email?: string;

    @IsString({ message: 'CCCD phải là chuỗi ký tự' })
    @MinLength(12, { message: 'CCCD phải có 12 ký tự' })
    @MaxLength(12, { message: 'CCCD phải có 12 ký tự' })
    @IsOptional()
    cccd?: string;

    @IsString({ message: 'Địa chỉ phải là chuỗi ký tự' })
    @IsOptional()
    address?: string;

    @IsString({ message: 'Nghề nghiệp phải là chuỗi ký tự' })
    @IsOptional()
    job?: string;

    @IsString({ message: 'Mối quan hệ phải là chuỗi ký tự' })
    @IsOptional()
    relationshipWithUser?: string;

    @IsNumber({}, { message: 'ID người dùng phải là số' })
    @IsOptional()
    userId?: number;
}