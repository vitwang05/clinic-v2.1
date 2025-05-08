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
import { EmployeeShift } from "./EmployeeShift";
import { Positions } from "./Positions";
import { Users } from "./Users";
import { Labtest } from "./Labtest";
import { Prescriptions } from "./Prescriptions";

@Index("employees_email_key", ["email"], { unique: true })
@Index("employees_pkey", ["id"], { unique: true })
@Index("employees_phone_number_key", ["phoneNumber"], { unique: true })
@Entity("employees", { schema: "employee" })
export class Employees {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("character varying", { name: "full_name" })
  fullName!: string;

  @Column("character varying", { name: "phone_number", unique: true })
  phoneNumber!: string;

  @Column("character varying", { name: "email", unique: true })
  email!: string;

  @Column("character varying", { name: "address" })
  address!: string;

  @Column("date", { name: "hire_date" })
  hireDate!: string;

  @Column("character varying", { name: "status" })
  status!: string;

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

  @OneToMany(() => Appointments, (appointments) => appointments.doctor)
  appointments!: Appointments[];

  @OneToMany(() => EmployeeShift, (employeeShift) => employeeShift.employee)
  employeeShifts!: EmployeeShift[];

  @ManyToOne(() => Positions, (positions) => positions.employees)
  @JoinColumn([{ name: "position_id", referencedColumnName: "id" }])
  position!: Positions;

  @ManyToOne(() => Users, (users) => users.employees)
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user!: Users;

  @OneToMany(() => Labtest, (labtest) => labtest.doctor)
  labtests!: Labtest[];

  @OneToMany(() => Prescriptions, (prescriptions) => prescriptions.doctor)
  prescriptions!: Prescriptions[];
}
