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
import { Patients } from "./Patients";
import { Tokens } from "./Tokens";
import { Transactions } from "./Transactions";
import { Roles } from "./Roles";

@Index("users_email_key", ["email"], { unique: true })
@Index("users_pkey", ["id"], { unique: true })
@Index("users_phone_number_key", ["phoneNumber"], { unique: true })
@Entity("users", { schema: "auth" })
export class Users {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("character varying", { name: "phone_number", unique: true })
  phoneNumber!: string;

  @Column("character varying", { name: "email", unique: true })
  email!: string;

  @Column("character varying", { name: "password", nullable: true })
  password!: string | null;

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

  @OneToMany(() => Employees, (employees) => employees.user)
  employees!: Employees[];

  @OneToMany(() => Patients, (patients) => patients.user)
  patients!: Patients[];

  @OneToMany(() => Tokens, (tokens) => tokens.user)
  tokens!: Tokens[];

  @OneToMany(() => Transactions, (transactions) => transactions.user)
  transactions!: Transactions[];

  @ManyToOne(() => Roles, (roles) => roles.users)
  @JoinColumn([{ name: "role_id", referencedColumnName: "id"}])
  role!: Roles;
}
