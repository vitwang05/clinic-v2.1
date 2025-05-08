import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PrescriptionDetail } from "./PrescriptionDetail";
import { InventoryTransaction } from "./InventoryTransaction";

@Index("medicine_pkey", ["id"], { unique: true })
@Entity("medicine", { schema: "inventory" })
export class Medicine {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("character varying", { name: "unit" })
  unit!: string;

  @Column("character varying", { name: "name" })
  name!: string;

  @Column("numeric", { name: "price", precision: 10, scale: 2 })
  price!: number;

  @Column("integer", { name: "stock_quantity", default: 0 })
  stockQuantity!: number;

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

  @OneToMany(
    () => InventoryTransaction,
    (transaction) => transaction.medicine
  )
  inventoryTransactions!: InventoryTransaction[];
}
