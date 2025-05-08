import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Employees } from "./Employees";
import { Shifts } from "./Shifts";

@Index("employee_shift_pkey", ["id"], { unique: true })
@Entity("employee_shift", { schema: "employee" })
export class EmployeeShift {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("date", { name: "shift_date" })
  shiftDate!: string;

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

  @ManyToOne(() => Employees, (employees) => employees.employeeShifts)
  @JoinColumn([{ name: "employee_id", referencedColumnName: "id" }])
  employee!: Employees;

  @ManyToOne(() => Shifts, (shifts) => shifts.employeeShifts)
  @JoinColumn([{ name: "shift_id", referencedColumnName: "id" }])
  shift!: Shifts;
}
