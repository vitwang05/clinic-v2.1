import { IsEmail, IsNumber, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class RegisterDTO {
    @IsEmail({}, { message: 'Email không hợp lệ' })
    email: string;

    @IsString()
    @MinLength(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt'
    })
    password: string;

    @IsString()
    @Matches(/^[0-9]{10,11}$/, { message: 'Số điện thoại không hợp lệ' })
    phoneNumber: string;

    @IsNumber()
    @IsOptional()
    employeeId?: number;
} 