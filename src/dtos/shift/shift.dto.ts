import { IsString, IsNotEmpty, IsOptional, IsTimeZone } from 'class-validator';

export class CreateShiftDTO {
    @IsString({ message: 'Tên ca làm việc phải là chuỗi ký tự' })
    @IsNotEmpty({ message: 'Tên ca làm việc không được để trống' })
    shiftName!: string;

    @IsString({ message: 'Thời gian bắt đầu không hợp lệ' })
    @IsNotEmpty({ message: 'Thời gian bắt đầu không được để trống' })
    startTime!: string;

    @IsString({ message: 'Thời gian kết thúc không hợp lệ' })
    @IsNotEmpty({ message: 'Thời gian kết thúc không được để trống' })
    endTime!: string;
}

export class UpdateShiftDTO {
    @IsString({ message: 'Tên ca làm việc phải là chuỗi ký tự' })
    @IsOptional()
    shiftName?: string;

    @IsString({ message: 'Thời gian bắt đầu không hợp lệ' })
    @IsOptional()
    startTime?: string;

    @IsString({ message: 'Thời gian kết thúc không hợp lệ' })
    @IsOptional()
    endTime?: string;
} 