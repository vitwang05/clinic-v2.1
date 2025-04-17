import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Medicine } from "./Medicine";
import { Prescriptions } from "./Prescriptions";

@Index("prescription_detail_pkey", ["id"], { unique: true })
@Entity("prescription_detail", { schema: "public" })
export class PrescriptionDetail {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("character varying", { name: "dosage", nullable: true })
  dosage!: string | null;

  @Column("character varying", { name: "frequency", nullable: true })
  frequency!: string | null;

  @Column("character varying", { name: "duration", nullable: true })
  duration!: string | null;

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

  @ManyToOne(() => Medicine, (medicine) => medicine.prescriptionDetails)
  @JoinColumn([{ name: "medicine_id", referencedColumnName: "id" }])
  medicine!: Medicine;

  @ManyToOne(
    () => Prescriptions,
    (prescriptions) => prescriptions.prescriptionDetails
  )
  @JoinColumn([{ name: "prescription_id", referencedColumnName: "id" }])
  prescription!: Prescriptions;
}
