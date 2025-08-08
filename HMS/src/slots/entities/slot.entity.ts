import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Doctor } from '../../doctors/entities/doctor.entity';
import { ShiftType } from './enums/shift.enum';

@Entity()
export class Slot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  date: string;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({
    type: 'enum',
    enum: ShiftType,
    default: ShiftType.MORNING,
  })
  shift: ShiftType;

  @Column({ default: 100 })
  maxBookingsPerSlot: number;

  @ManyToOne(() => Doctor, (doctor) => doctor.slots, { onDelete: 'CASCADE' })
  doctor: Doctor;
}
