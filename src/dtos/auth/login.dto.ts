import { IsEmail, IsString } from 'class-validator';

export class LoginDTO {
    @IsEmail({}, { message: 'Email không hợp lệ' })
    email: string;

    @IsString({ message: 'Mật khẩu là bắt buộc' })
    password: string;
} 