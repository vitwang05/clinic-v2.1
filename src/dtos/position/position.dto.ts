export class CreatePositionDTO {
    positionName!: string;
    description?: string;
    departmentId!: number;
}

export class UpdatePositionDTO {
    positionName?: string;
    description?: string;
    departmentId?: number;
} 