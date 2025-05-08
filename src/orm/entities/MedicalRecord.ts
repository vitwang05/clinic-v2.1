import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Labtest } from "./Labtest";
import { Appointments } from "./Appointments";
import { Prescriptions } from "./Prescriptions";

@Index("medical_record_appointment_id_key", ["appointmentId"], { unique: true })
@Index("medical_record_pkey", ["id"], { unique: true })
@Entity("medical_record", { schema: "appointment" })
export class MedicalRecord {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("integer", { name: "appointment_id", nullable: true, unique: true })
  appointmentId!: number | null;

  @Column("text", { name: "diagnosis", nullable: true })
  diagnosis!: string | null;

  @Column("text", { name: "prescription_notes", nullable: true })
  prescriptionNotes!: string | null;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt!: Date | null;

  @Column("timestamp without time zone", {
    name: "updated_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt!: Date | null;

  @OneToMany(() => Labtest, (labtest) => labtest.medicalRecord)
  labtests!: Labtest[];

  @OneToOne(() => Appointments, (appointments) => appointments.medicalRecord)
  @JoinColumn([{ name: "appointment_id", referencedColumnName: "id" }])
  appointment!: Appointments;

  @OneToMany(
    () => Prescriptions,
    (prescriptions) => prescriptions.medicalRecord
  )
  prescriptions!: Prescriptions[];
}
