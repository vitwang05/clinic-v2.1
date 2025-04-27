import { DataSource } from "typeorm";
import { Prescriptions } from "../orm/entities/Prescriptions";
import { CommonRepository } from "./CommonRepository";
import { CreatePrescriptionDTO } from "../dtos/prescription/prescription.dto";
import { Employees } from "../orm/entities/Employees";
import { MedicalRecord } from "../orm/entities/MedicalRecord";
import { Medicine } from "../orm/entities/Medicine";
import { PrescriptionDetail } from "../orm/entities/PrescriptionDetail";
export class PrescriptionsRepository extends CommonRepository<Prescriptions> {
  constructor(dataSource: DataSource) {
    super(Prescriptions, dataSource);
  }
  async createWithDetails(dto: CreatePrescriptionDTO): Promise<Prescriptions> {
    const manager = this.manager;

    // Fetch doctor and medical record
    const doctor = await manager.findOneByOrFail(Employees, {
      id: dto.doctorId,
    });
    console.log(doctor);
    const record = await manager.findOneByOrFail(MedicalRecord, {
      id: dto.medicalRecordId,
    });
    console.log(record);
    // Create prescription entity
    const prescription = new Prescriptions();
    prescription.notes = dto.notes ?? null;
    prescription.doctor = doctor;
    prescription.medicalRecord = record;
    // total will be calculated after details
    prescription.total = 0;
    prescription.createdAt = new Date();
    prescription.updatedAt = new Date();

    const savedPrescription = await manager.save(Prescriptions, prescription);

    // Create detail entities
    let total = 0;
    const detailEntities: PrescriptionDetail[] = [];
    for (const item of dto.prescriptionDetails) {
      const medicine = await manager.findOneByOrFail(Medicine, {
        id: item.medicineId,
      });
      total += medicine.price;

      const detail = new PrescriptionDetail();
      detail.prescription = savedPrescription; // Associate with the saved prescription
      detail.medicine = medicine;
      detail.dosage = item.dosage ?? null;
      detail.frequency = item.frequency ?? null;
      detail.duration = item.duration ?? null;
      detail.createdAt = new Date();
      detail.updatedAt = new Date();

      detailEntities.push(detail);
    }
    // Save details
    await manager.save(PrescriptionDetail, detailEntities);

    // Update prescription total
    savedPrescription.total = total;
    savedPrescription.updatedAt = new Date();
    return manager.save(Prescriptions, savedPrescription);
  }
}
