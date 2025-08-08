import { BadRequestException, Injectable } from '@nestjs/common';
import * as moment from 'moment-timezone';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { Slot } from '../slots/entities/slot.entity';
import { AppointmentStatus } from './entities/enum.entity';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AppointmentTimeService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
  ) {}

  async validateAppointmentTime(
    slot: Slot,
    appointmentTime: string,
    isEmergency: boolean,
  ): Promise<void> {
    const appointmentMoment = moment.tz(
      `${slot.date} ${appointmentTime}`,
      [
        'YYYY-MM-DD HH:mm',
        'DD-MM-YYYY HH:mm',
        'YYYY-MM-DD hh:mma',
        'DD-MM-YYYY hh:mma',
      ],
      true,
      'Asia/Kolkata',
    );

    if (!appointmentMoment.isValid()) {
      throw new BadRequestException('Invalid appointment time format');
    }

    // ✅ Weekend check
    const day = appointmentMoment.format('dddd');
    const isWeekend = ['Saturday', 'Sunday'].includes(day);
    if (isWeekend && !isEmergency) {
      throw new BadRequestException(
        'Only emergency appointments are allowed on weekends',
      );
    }

    // Booking allowed only between 8:00am-9:00am IST
    const startTime = moment.tz('Asia/Kolkata').hour(8).minute(0).toDate();
    const endTime = moment.tz('Asia/Kolkata').hour(22).minute(0).toDate();
    const now = moment().tz('Asia/Kolkata').toDate();

    if (now < startTime || now > endTime) {
      throw new BadRequestException(
        'Appointment can only be booked between 8:00am and 09:00am IST',
      );
    }

    const slotStart = moment.tz(
      `${slot.date} ${slot.startTime}`,
      'YYYY-MM-DD hh:mma',
      'Asia/Kolkata',
    );
    const slotEnd = moment.tz(
      `${slot.date} ${slot.endTime}`,
      'YYYY-MM-DD hh:mma',
      'Asia/Kolkata',
    );

    if (
      appointmentMoment.isBefore(slotStart) ||
      appointmentMoment.isAfter(slotEnd)
    ) {
      throw new BadRequestException(
        "Appointment time is outside doctor's slot",
      );
    }

    // ✅ Conflict check
    const doctorId = slot.doctor.id;

    const conflictingAppointment = await this.appointmentRepo
      .createQueryBuilder('appointment')
      .leftJoin('appointment.slot', 'slot')
      .leftJoin('slot.doctor', 'doctor')
      .where('doctor.id = :doctorId', { doctorId })
      .andWhere('slot.date = :date', { date: slot.date })
      .andWhere('appointment.appointmentTime = :appointmentTime', {
        appointmentTime,
      })
      .andWhere('appointment.status = :status', {
        status: AppointmentStatus.BOOKED,
      })
      .getOne();

    if (conflictingAppointment) {
      throw new BadRequestException(
        'Doctor is not available at this appointment time',
      );
    }
  }

  // ✅ Auto-expire logic every 5 min
  @Cron('*/5 * * * *')
  async autoExpireAppointments() {
    const now = new Date();
    await this.appointmentRepo
      .createQueryBuilder()
      .update(Appointment)
      .set({ status: AppointmentStatus.EXPIRED })
      .where('expiresAt < :now', { now })
      .andWhere('status = :status', { status: AppointmentStatus.BOOKED })
      .execute();
  }

  // ✅ Auto mark MISSED after 10 minutes of appointmentTime
  @Cron('*/5 * * * *') // every 5 minutes
  async autoMarkMissedAppointments() {
    const now = moment().tz('Asia/Kolkata');
    const appointments = await this.appointmentRepo.find({
      where: { status: AppointmentStatus.BOOKED },
      relations: ['slot'],
    });

    for (const appointment of appointments) {
      const appointmentDateTime = moment.tz(
        `${appointment.slot.date} ${appointment.appointmentTime}`,
        'YYYY-MM-DD HH:mm',
        'Asia/Kolkata',
      );

      const graceTime = appointmentDateTime.clone().add(10, 'minutes');

      if (now.isAfter(graceTime)) {
        appointment.status = AppointmentStatus.MISSED;
        await this.appointmentRepo.save(appointment);
      }
    }
  }
}
