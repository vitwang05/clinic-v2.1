import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Appointments } from "./Appointments";

@Index("time_frame_pkey", ["id"], { unique: true })
@Entity("time_frame", { schema: "public" })
export class TimeFrame {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("character varying", { name: "timeFrame_name" })
  timeFrameName!: string;

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

  @OneToMany(() => Appointments, (appointments) => appointments.timeFrame)
  appointments!: Appointments[];
}
