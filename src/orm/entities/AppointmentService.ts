import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from "typeorm";
  import { Appointments } from "./Appointments";
  import { Services } from "./Services";
  
  @Entity("appointment_services", {schema: "appointment"})
  export class AppointmentServices {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Appointments, (appointment) => appointment.appointmentServices, {
      onDelete: "CASCADE",
    })
    @JoinColumn({ name: "appointment_id" })
    appointment: Appointments;
  
    @ManyToOne(() => Services, (service) => service.appointmentServices, {
      onDelete: "CASCADE",
    })
    @JoinColumn({ name: "service_id" })
    service: Services;
  
    @Column("text", { nullable: true })
    note: string | null;
  
    @Column("numeric", { precision: 10, scale: 2, nullable: true })
    customPrice: number | null;
  }
  