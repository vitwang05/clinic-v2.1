import {
    Column,
    Entity,
    Index,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from "typeorm";
  import { Medicine } from "./Medicine";
  
  export type InventoryTransactionType = "import" | "export";
  
  @Entity("inventory_transaction", { schema: "public" })
  export class InventoryTransaction {
    @PrimaryGeneratedColumn({ type: "integer", name: "id" })
    id!: number;
  
    @Column("enum", {
      name: "type",
      enum: ["import", "export"],
    })
    type!: InventoryTransactionType;
  
    @Column("integer", { name: "quantity" })
    quantity!: number;
  
    @Column("timestamp without time zone", {
      name: "created_at",
      default: () => "CURRENT_TIMESTAMP",
    })
    createdAt!: Date;
  
    @ManyToOne(() => Medicine, (medicine) => medicine.inventoryTransactions, {
      onDelete: "CASCADE",
    })
    medicine!: Medicine;
  }
  