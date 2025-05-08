import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EmployeeShift } from "./EmployeeShift";

@Index("shifts_pkey", ["id"], { unique: true })
@Entity("shifts", { schema: "employee" })
export class Shifts {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("character varying", { name: "shift_name" })
  shiftName!: string;

  @Column("time without time zone", { name: "start_time" })
  startTime!: string;

  @Column("time without time zone", { name: "end_time" })
  endTime!: string;

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

  @OneToMany(() => EmployeeShift, (employeeShift) => employeeShift.shift)
  employeeShifts!: EmployeeShift[];
}
