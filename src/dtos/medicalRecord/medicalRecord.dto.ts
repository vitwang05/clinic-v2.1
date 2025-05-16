import { IsString, IsOptional } from "class-validator";

export class UpdateMedicalRecordDTO {
    @IsString({ message: 'Tên thuốc phải là chuỗi' })
    @IsOptional()
    diagnosis?: string;

    @IsString({ message: 'Đơn vị tính phải là chuỗi' })
    @IsOptional()   
    prescriptionNotes?: string;
}