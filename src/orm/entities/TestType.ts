import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Labtest } from "./Labtest";

@Index("test_type_pkey", ["id"], { unique: true })
@Entity("test_type", { schema: "public" })
export class TestType {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("character varying", { name: "name" })
  name!: string;

  @Column("numeric", { name: "price", precision: 10, scale: 2 })
  price!: number;

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

  @OneToMany(() => Labtest, (labtest) => labtest.testType)
  labtests!: Labtest[];
}
