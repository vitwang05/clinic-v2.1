import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Appointments } from "./Appointments";
import { Users } from "./Users";

@Index("patients_CCCD_key", ["cccd"], { unique: true })
@Index("patients_email_key", ["email"], { unique: true })
@Index("patients_pkey", ["id"], { unique: true })
@Index("patients_phone_number_key", ["phoneNumber"], { unique: true })
@Entity("patients", { schema: "public" })
export class Patients {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("character varying", { name: "full_name", nullable: true })
  fullName!: string | null;

  @Column("date", { name: "dob", nullable: true })
  dob!: string | null;

  @Column("character", { name: "gender", nullable: true, length: 1 })
  gender!: string | null;

  @Column("character varying", {
    name: "phone_number",
    nullable: true,
    unique: true,
  })
  phoneNumber!: string | null;

  @Column("character varying", { name: "email", nullable: true, unique: true })
  email!: string | null;

  @Column("character varying", { name: "CCCD", nullable: true, unique: true })
  cccd!: string | null;

  @Column("text", { name: "address", nullable: true })
  address!: string | null;

  @Column("character varying", { name: "job", nullable: true })
  job!: string | null;

  @Column("character varying", {
    name: "relationship_with_user",
    nullable: true,
  })
  relationshipWithUser!: string | null;

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

  @OneToMany(() => Appointments, (appointments) => appointments.patient)
  appointments!: Appointments[];

  @ManyToOne(() => Users, (users) => users.patients)
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user!: Users;
}
