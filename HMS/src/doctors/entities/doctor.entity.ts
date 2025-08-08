import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Slot } from '../../slots/entities/slot.entity';
@Entity()
export class Doctor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  specialization: string;

  @Column({ default: 'doctor' })
  role: string;

  @Column({ nullable: true })
  age: string;

  @Column({ nullable: true })
  gender: string;

  @OneToMany(() => Slot, (slot) => slot.doctor)
  slots: Slot[]; // ✅ This line solves the error
}
