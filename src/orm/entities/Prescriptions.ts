import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PrescriptionDetail } from "./PrescriptionDetail";
import { Employees } from "./Employees";
import { MedicalRecord } from "./MedicalRecord";
import { Transactions } from "./Transactions";

@Index("prescriptions_pkey", ["id"], { unique: true })
@Entity("prescriptions", { schema: "public" })
export class Prescriptions {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("text", { name: "notes", nullable: true })
  notes!: string | null;

  @Column("numeric", { name: "total", nullable: true, precision: 10, scale: 2 })
  total!: number | null;

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

  @OneToMany(
    () => PrescriptionDetail,
    (prescriptionDetail) => prescriptionDetail.prescription
  )
  prescriptionDetails!: PrescriptionDetail[];

  @ManyToOne(() => Employees, (employees) => employees.prescriptions)
  @JoinColumn([{ name: "doctor_id", referencedColumnName: "id" }])
  doctor!: Employees;

  @ManyToOne(
    () => MedicalRecord,
    (medicalRecord) => medicalRecord.prescriptions
  )
  @JoinColumn([{ name: "medical_record_id", referencedColumnName: "id" }])
  medicalRecord!: MedicalRecord;

  @OneToMany(() => Transactions, (transactions) => transactions.prescription)
  transactions!: Transactions[];
}
