import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Positions } from "./Positions";

@Index("departments_pkey", ["id"], { unique: true })
@Entity("departments", { schema: "employee" })
export class Departments {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("character varying", { name: "department_name" })
  departmentName!: string;

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

  @OneToMany(() => Positions, (positions) => positions.department)
  positions!: Positions[];
}
