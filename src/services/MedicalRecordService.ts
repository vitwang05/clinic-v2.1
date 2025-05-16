import { DataSource } from "typeorm";
import { MedicalRecord } from "../orm/entities/MedicalRecord";
import { AppointmentStatus } from "../dtos/appointment/appointment.dto";
import { Labtest } from "../orm/entities/Labtest";
import { Prescriptions } from "../orm/entities/Prescriptions";
import { UpdateMedicalRecordDTO } from "../dtos/medicalRecord/medicalRecord.dto";
export class MedicalRecordService {
    constructor(
        private readonly dataSource: DataSource
    ) {}


    async getMedicalRecord(patientId: number) {
        const repo = this.dataSource.getRepository(MedicalRecord);
        const medicalRecord = await repo.find({
            where: {
                appointment: { patient: { id: patientId }, status: AppointmentStatus.COMPLETED }
            },
            relations: ["appointment.patient"]
        });
        if (medicalRecord.length !== 0) {
            for (const record of medicalRecord) {
                const labtest = await this.dataSource.getRepository(Labtest).find({
                    where: {
                        medicalRecord: { id: record.id }
                    },
                    relations: ["testType"]
                });
                const prescription = await this.dataSource.getRepository(Prescriptions).find({
                    where: {
                        medicalRecord: { id: record.id }
                    },
                    relations: ["prescriptionDetails.medicine"]
                });
                record.labtests = labtest;
                record.prescriptions = prescription;
            }
        }
        return medicalRecord;
    }

    async updateMedicalRecord(medicalRecordId: number, dto: UpdateMedicalRecordDTO) {
        const repo = this.dataSource.getRepository(MedicalRecord);
        console.log(medicalRecordId);
        const medicalRecord = await repo.findOne({
            where: {
                id: medicalRecordId
            }
        });
        console.log(medicalRecord);
        if (!medicalRecord) {
            throw new Error("Medical record not found");
        }
        medicalRecord.diagnosis = dto.diagnosis;
        medicalRecord.prescriptionNotes = dto.prescriptionNotes;
        await repo.save(medicalRecord);
        return medicalRecord;
    }
}
