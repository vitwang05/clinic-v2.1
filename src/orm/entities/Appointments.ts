import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Employees } from "./Employees";
import { Patients } from "./Patients";
import { TimeFrame } from "./TimeFrame";
import { MedicalRecord } from "./MedicalRecord";
import { Transactions } from "./Transactions";
import { AppointmentServices } from "./AppointmentService";

@Index("appointments_pkey", ["id"], { unique: true })
@Entity("appointments")
export class Appointments {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("date", { name: "date" })
  date!: string;

  @Column("character varying", { name: "status" })
  status!: string;

  @Column("text", { name: "notes", nullable: true })
  notes!: string | null;

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

  @ManyToOne(() => Employees, (employees) => employees.appointments)
  @JoinColumn([{ name: "doctor_id", referencedColumnName: "id" }])
  doctor!: Employees;

  @ManyToOne(() => Patients, (patients) => patients.appointments)
  @JoinColumn([{ name: "patient_id", referencedColumnName: "id" }])
  patient!: Patients;

  @ManyToOne(() => TimeFrame, (timeFrame) => timeFrame.appointments)
  @JoinColumn([{ name: "time_frame_id", referencedColumnName: "id" }])
  timeFrame!: TimeFrame;

  @OneToOne(() => MedicalRecord, (medicalRecord) => medicalRecord.appointment)
  medicalRecord!: MedicalRecord;

  @OneToMany(() => Transactions, (transactions) => transactions.appointment)
  transactions!: Transactions[];

  @OneToMany(() => AppointmentServices, (as) => as.appointment)
  appointmentServices!: AppointmentServices[];
}
