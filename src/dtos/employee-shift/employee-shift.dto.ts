import { IsNumber, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';

export class CreateEmployeeShiftDTO {
    @IsNumber({}, { message: 'ID nhân viên phải là số' })
    @IsNotEmpty({ message: 'ID nhân viên không được để trống' })
    employeeId!: number;

    @IsNumber({}, { message: 'ID ca làm việc phải là số' })
    @IsNotEmpty({ message: 'ID ca làm việc không được để trống' })
    shiftId!: number;

    @IsDateString({}, { message: 'Ngày làm việc không hợp lệ' })
    @IsNotEmpty({ message: 'Ngày làm việc không được để trống' })
    shiftDate!: string;
}

export class UpdateEmployeeShiftDTO {
    @IsNumber({}, { message: 'ID nhân viên phải là số' })
    @IsOptional()
    employeeId?: number;

    @IsNumber({}, { message: 'ID ca làm việc phải là số' })
    @IsOptional()
    shiftId?: number;

    @IsDateString({}, { message: 'Ngày làm việc không hợp lệ' })
    @IsOptional()
    shiftDate?: string;
} 