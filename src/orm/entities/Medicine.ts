import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PrescriptionDetail } from "./PrescriptionDetail";

@Index("medicine_pkey", ["id"], { unique: true })
@Entity("medicine", { schema: "public" })
export class Medicine {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("character varying", { name: "unit" })
  unit!: string;

  @Column("numeric", { name: "price", precision: 10, scale: 2 })
  price!: string;

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
    (prescriptionDetail) => prescriptionDetail.medicine
  )
  prescriptionDetails!: PrescriptionDetail[];
}
