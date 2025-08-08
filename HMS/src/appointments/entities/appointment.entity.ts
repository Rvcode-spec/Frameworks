import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';
import { Slot } from '../../slots/entities/slot.entity';
import { AppointmentStatus } from './enum.entity';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date', nullable: true })
  date: string;

  @Column()
  patientId: string;

  @Column()
  slotId: string;

  @ManyToOne(() => Patient, { eager: true })
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @ManyToOne(() => Slot, { eager: true })
  @JoinColumn({ name: 'slotId' })
  slot: Slot;

  @Column({ default: false })
  isEmergency: boolean;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @Column({ nullable: true })
  appointmentTime: string;

  @UpdateDateColumn({ nullable: true })
  attendedAt?: Date;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.BOOKED,
  })
  status: AppointmentStatus;
}
