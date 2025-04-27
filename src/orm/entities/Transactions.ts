import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Prescriptions } from "./Prescriptions";
import { Users } from "./Users";
import { Appointments } from "./Appointments";
@Index("transactions_pkey", ["id"], { unique: true })
@Entity("transactions", { schema: "public" })
export class Transactions {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("numeric", {
    name: "totalMoney",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  totalMoney!: number | null;

  @ManyToOne(() => Appointments, (appointments) => appointments.transactions)
  @JoinColumn([{ name: "appointment_id", referencedColumnName: "id" }])
  appointment!: Appointments;
  

  @ManyToOne(() => Prescriptions, (prescriptions) => prescriptions.transactions)
  @JoinColumn([{ name: "prescription_id", referencedColumnName: "id" }])
  prescription!: Prescriptions;

  @ManyToOne(() => Users, (users) => users.transactions)
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user!: Users;
}
