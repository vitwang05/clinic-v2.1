import { IsNumber, IsString, IsDateString, IsEnum, IsOptional, IsNotEmpty, IsArray, IsBoolean } from 'class-validator';

export enum AppointmentStatus {
    PENDING = 'pending',           // Đang chờ xác nhận
    CONFIRMED = 'confirmed',       // Đã xác nhận
    CANCELLED = 'cancelled',       // Đã hủy
    CHECKED_IN = 'checked_in',     // Bệnh nhân đã đến và check-in tại quầy
    WAITING = 'waiting',           // Đã check-in nhưng đang chờ gọi vào khám
    CALLED = 'called',             // Đã được gọi vào phòng khám
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

    @IsBoolean()
    @IsOptional()
    isWalkIn?: boolean;

    @IsArray()
    @IsOptional()
    services?: number[]=[];
}

export class UpdateAppointmentDTO {
    @IsEnum(AppointmentStatus)
    @IsOptional()
    status?: AppointmentStatus;

    @IsString()
    @IsOptional()
    notes?: string;
}