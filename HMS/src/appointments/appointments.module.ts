import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { Slot } from '../slots/entities/slot.entity';
import { RescheduleAppointmentService } from './reschedule-appointment.service';
import { AppointmentTimeService } from './appointment.time.service';
import { Patient } from 'src/patients/entities/patient.entity';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, Slot, Patient]), MailModule],
  providers: [
    AppointmentsService,
    RescheduleAppointmentService,
    AppointmentTimeService,
  ],
  controllers: [AppointmentsController],
})
export class AppointmentsModule {}
