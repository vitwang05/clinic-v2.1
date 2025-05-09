import { IsNotEmpty } from "class-validator";

import { IsString } from "class-validator";

export class CreateTimeFrameDTO {
    @IsString({ message: 'Time frame name must be a string' })
    @IsNotEmpty({ message: 'Time frame name is required' })
    timeFrameName: string;
    @IsString({ message: 'Start time must be a string' })
    @IsNotEmpty({ message: 'Start time is required' })
    startTime: string;
    @IsString({ message: 'End time must be a string' })
    @IsNotEmpty({ message: 'End time is required' })
    endTime: string;
}

export class UpdateTimeFrameDTO {
    timeFrameName?: string;
    startTime?: string;
    endTime?: string;
}

export class GetDoctorTimeFramesDTO {
    doctorId: number;
    date: string; // Format: YYYY-MM-DD
} 