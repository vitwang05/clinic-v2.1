import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    OneToMany,
} from 'typeorm';
import { AppointmentServices } from './AppointmentService';
  
  @Index("service_pkey", ["id"], { unique: true })
  @Entity('services',{ schema: "service" })
  export class Services {
    @PrimaryGeneratedColumn({ type: "integer", name: "id" })
    id: number;
  
    @Column({ name: "name", type: 'varchar', length: 255 })
    name: string;
  
    @Column({ name: "description", type: 'text', nullable: true })
    description: string;
  
    @Column({ type: 'numeric', name: "price", precision: 10, scale: 2 })
    price: number;
  
    @Column({ name: "is_active", type: 'boolean', default: true })
    isActive: boolean;
  
    @CreateDateColumn({ name: "created_at", type: 'timestamp' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: "updated_at", type: 'timestamp' })
    updatedAt: Date;

    @OneToMany(() => AppointmentServices, (as) => as.service)
    appointmentServices!: AppointmentServices[];
  }
  