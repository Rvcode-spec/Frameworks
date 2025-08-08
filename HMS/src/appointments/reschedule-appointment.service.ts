import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { Slot } from 'src/slots/entities/slot.entity';
import { AppointmentStatus } from './entities/enum.entity';
import * as moment from 'moment-timezone';

@Injectable()
export class RescheduleAppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    @InjectRepository(Slot)
    private readonly slotRepo: Repository<Slot>,
  ) {}

  async rescheduleAppointment(
    id: string,
    newSlotId: string,
  ): Promise<Appointment> {
    const appointment = await this.appointmentRepo.findOne({ where: { id } });
    if (!appointment) throw new NotFoundException('Appointment not found');

    const newSlot = await this.slotRepo.findOne({
      where: { id: newSlotId },
      relations: ['doctor'],
    });
    if (!newSlot) throw new NotFoundException('New slot not found');

    // Date format validation
    let parsedDate: moment.Moment;
    if (moment(newSlot.date, 'YYYY-MM-DD', true).isValid()) {
      parsedDate = moment(newSlot.date, 'YYYY-MM-DD');
    } else if (moment(newSlot.date, 'DD-MM-YYYY', true).isValid()) {
      parsedDate = moment(newSlot.date, 'DD-MM-YYYY');
    } else {
      throw new BadRequestException('Invalid new slot date format');
    }

    const endTime = parsedDate.tz('Asia/Kolkata').hour(9).minute(0).toDate();

    appointment.slot = newSlot;
    appointment.status = AppointmentStatus.RESCHEDULED;
    appointment.expiresAt = endTime;

    return this.appointmentRepo.save(appointment);
  }
}
