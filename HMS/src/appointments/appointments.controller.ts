import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { RescheduleAppointmentService } from './reschedule-appointment.service';
import { BookAppointmentDto } from './dto/book-appointment.dto';
import { RescheduleAppointmentDto } from './dto/reschedule.appointment.dto';
import { Appointment } from './entities/appointment.entity';

@Controller('appointments')
export class AppointmentsController {
  constructor(
    private readonly appointmentService: AppointmentsService,
    private readonly rescheduleAppointmentService: RescheduleAppointmentService,
  ) {}

  @Post('book')
  book(@Body() dto: BookAppointmentDto) {
    return this.appointmentService.bookAppointment(dto);
  }

  @Get('patient/:id')
  getForPatient(@Param('id') patientId: string) {
    return this.appointmentService.getPatientAppointments(patientId);
  }

  @Get()
  getAll() {
    return this.appointmentService.getAllAppointments();
  }

  @Patch('cancel/:id')
  cancel(@Param('id') id: string) {
    return this.appointmentService.cancelAppointment(id);
  }

  @Patch('/reschedule')
  reschedule(@Param('id') id: string, @Body() dto: RescheduleAppointmentDto) {
    return this.rescheduleAppointmentService.rescheduleAppointment(
      id,
      dto.newSlotId,
    );
  }

  // ✅ Mark as Attended patient
  @Patch(':id/attend')
  markAsAttended(@Param('id') id: string): Promise<Appointment> {
    return this.appointmentService.markAsAttended(id);
  }
}
