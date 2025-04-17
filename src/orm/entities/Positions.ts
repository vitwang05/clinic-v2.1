import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Employees } from "./Employees";
import { Departments } from "./Departments";

@Index("positions_pkey", ["id"], { unique: true })
@Entity("positions", { schema: "public" })
export class Positions {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("character varying", { name: "position_name" })
  positionName!: string;

  @Column("text", { name: "description", nullable: true })
  description!: string | null;

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

  @OneToMany(() => Employees, (employees) => employees.position)
  employees!: Employees[];

  @ManyToOne(() => Departments, (departments) => departments.positions)
  @JoinColumn([{ name: "department_id", referencedColumnName: "id" }])
  department!: Departments;
}
