import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Employees } from "./Employees";
import { MedicalRecord } from "./MedicalRecord";
import { TestType } from "./TestType";

@Index("labtest_pkey", ["id"], { unique: true })
@Entity("labtest", { schema: "public" })
export class Labtest {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("character varying", { name: "result", nullable: true })
  result!: string | null;

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

  @ManyToOne(() => Employees, (employees) => employees.labtests)
  @JoinColumn([{ name: "doctor_id", referencedColumnName: "id" }])
  doctor!: Employees;

  @ManyToOne(() => MedicalRecord, (medicalRecord) => medicalRecord.labtests)
  @JoinColumn([{ name: "medical_record_id", referencedColumnName: "id" }])
  medicalRecord!: MedicalRecord;

  @ManyToOne(() => TestType, (testType) => testType.labtests)
  @JoinColumn([{ name: "test_type_id", referencedColumnName: "id" }])
  testType!: TestType;
}
