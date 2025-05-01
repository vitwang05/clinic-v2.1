import { IsNumber, IsString, IsDateString, IsEnum, IsOptional, IsNotEmpty, IsArray } from 'class-validator';

export enum AppointmentStatus {
    PENDING = 'pending',           // Đang chờ xác nhận
    CONFIRMED = 'confirmed',       // Đã xác nhận
    CANCELLED = 'cancelled',       // Đã hủy
    IN_PROGRESS = 'in_progress',   // Đang khám
    COMPLETED = 'completed',       // Đã hoàn thành
    NO_SHOW = 'no_show'           // Không đến khám
}

export class CreateAppointmentDTO {
    @IsNumber()
    @IsNotEmpty({ message: 'ID bác sĩ không được để trống' })
    doctorId!: number;

    @IsNumber()
    @IsNotEmpty({ message: 'ID bệnh nhân không được để trống' })
    patientId!: number;

    @IsNumber()
    @IsNotEmpty({ message: 'ID khung giờ không được để trống' })
    timeFrameId!: number;

    @IsDateString()
    @IsNotEmpty({ message: 'Ngày khám không được để trống' })
    date!: string;

    @IsString()
    @IsOptional()
    notes?: string;

    @IsArray()
    @IsOptional()
    services?: number[];
}

export class UpdateAppointmentDTO {
    @IsEnum(AppointmentStatus)
    @IsOptional()
    status?: AppointmentStatus;

    @IsString()
    @IsOptional()
    notes?: string;
}