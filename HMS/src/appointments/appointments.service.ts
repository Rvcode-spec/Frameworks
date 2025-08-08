import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { BookAppointmentDto } from './dto/book-appointment.dto';
import { AppointmentStatus } from './entities/enum.entity';
import { Slot } from 'src/slots/entities/slot.entity';
import { AppointmentTimeService } from './appointment.time.service';
import * as moment from 'moment-timezone';
import { MailService } from '../mail/mail.service';
import { Patient } from 'src/patients/entities/patient.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,

    @InjectRepository(Slot)
    private readonly slotRepo: Repository<Slot>,

    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,

    private readonly appointmentTimeService: AppointmentTimeService,

    private readonly mailService: MailService, // ✅ injected mail service
  ) {}

  async bookAppointment(dto: BookAppointmentDto): Promise<Appointment> {
    const slot = await this.slotRepo.findOne({
      where: { id: dto.slotId },
      relations: ['doctor'],
    });

    if (!slot) throw new NotFoundException('Slot not found');

    const isEmergency = dto.isEmergency ?? false;

    // ✅ Booking limit check
    const existingAppointments = await this.appointmentRepo.count({
      where: { slotId: slot.id },
    });

    if (existingAppointments >= slot.maxBookingsPerSlot) {
      throw new BadRequestException(
        `Slot already full. Max bookings allowed: ${slot.maxBookingsPerSlot}`,
      );
    }

    // ✅ Parse slot date
    let parsedDate: moment.Moment;
    if (moment(slot.date, 'YYYY-MM-DD', true).isValid()) {
      parsedDate = moment(slot.date, 'YYYY-MM-DD');
    } else if (moment(slot.date, 'DD-MM-YYYY', true).isValid()) {
      parsedDate = moment(slot.date, 'DD-MM-YYYY');
    } else {
      throw new BadRequestException('Invalid slot date format');
    }

    // ✅ Past date check
    const today = moment().tz('Asia/Kolkata').startOf('day');
    const slotDate = parsedDate.clone().startOf('day');
    if (slotDate.isBefore(today)) {
      throw new BadRequestException('Cannot book appointment for a past date');
    }

    // ✅ Validate appointmentTime
    if (dto.appointmentTime) {
      await this.appointmentTimeService.validateAppointmentTime(
        slot,
        dto.appointmentTime,
        isEmergency,
      );
    }

    // ✅ Set expiration
    const expiresAt = parsedDate
      .tz('Asia/Kolkata')
      .hour(9)
      .minute(0)
      .second(0)
      .toDate();

    // ✅ Create appointment
    const appointment = this.appointmentRepo.create({
      patientId: dto.patientId,
      slotId: dto.slotId,
      appointmentTime: dto.appointmentTime,
      isEmergency,
      date: dto.date,
      status: AppointmentStatus.BOOKED,
      expiresAt,
    });

    const savedAppointment = await this.appointmentRepo.save(appointment);

    // ✅ Fetch patient info
    const patient = await this.patientRepo.findOne({
      where: { id: dto.patientId },
    });

    if (patient?.email && patient?.name) {
      // ✅ Send email notification
      await this.mailService.sendAppointmentBookedEmail(
        patient.email,
        patient.name,
        slot.date,
        `${slot.startTime} - ${slot.endTime}`,
      );
    }

    return savedAppointment;
  }

  async cancelAppointment(id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepo.findOne({ where: { id } });
    if (!appointment) throw new NotFoundException('Appointment not found');

    appointment.status = AppointmentStatus.CANCELLED;
    return this.appointmentRepo.save(appointment);
  }

  async markAsAttended(id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepo.findOne({ where: { id } });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    appointment.status = AppointmentStatus.ATTENDED;
    appointment.attendedAt = new Date();
    return this.appointmentRepo.save(appointment);
  }

  async getPatientAppointments(patientId: string): Promise<Appointment[]> {
    try {
      return await this.appointmentRepo.find({
        where: { patient: { id: patientId } },
        relations: ['slot', 'patient'],
      });
    } catch (error) {
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'Failed to fetch appointments',
      );
    }
  }

  async getAllAppointments(): Promise<Appointment[]> {
    try {
      return await this.appointmentRepo.find({
        relations: ['slot', 'patient'],
      });
    } catch (error) {
      throw new InternalServerErrorException(
        error instanceof Error
          ? error.message
          : 'Failed to fetch all appointments',
      );
    }
  }
}
