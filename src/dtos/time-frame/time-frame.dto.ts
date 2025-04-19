export class CreateTimeFrameDTO {
    timeFrameName: string;
    startTime: string;
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