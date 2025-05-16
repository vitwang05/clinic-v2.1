// import { toMedicalRecordDTO } from "../dtos/medicalRecord/medicalRecord.dto";
import { UpdateMedicalRecordDTO } from "../dtos/medicalRecord/medicalRecord.dto";
import { MedicalRecordService } from "../services/MedicalRecordService";
import { ApiResponse } from "../utils/ApiResponse";
import { Request, Response } from "express";

export class MedicalRecordController {
    constructor(private medicalRecordService: MedicalRecordService) {}

    async getMedicalRecord(req: Request, res: Response) {
        try {
            const patientId = Number(req.params.patientId);
            const medicalRecord = await this.medicalRecordService.getMedicalRecord(patientId);
            res.status(200).json(ApiResponse.success(medicalRecord));
        } catch (error) {
            res.status(500).json(ApiResponse.error(error.message));
        }
    }
    async updateMedicalRecord(req: Request, res: Response) {
        try {
            const medicalID = Number(req.params.medicalRecordId);
            const dto: UpdateMedicalRecordDTO = req.body;
            console.log(dto);
            const medicalRecord = await this.medicalRecordService.updateMedicalRecord(medicalID, dto);
            res.status(200).json(ApiResponse.success(medicalRecord));
        } catch (error) {
            res.status(500).json(ApiResponse.error(error.message));
        }
    }
}