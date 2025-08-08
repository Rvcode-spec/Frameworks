import { Controller, Get, Body, Patch, Param } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { plainToInstance } from 'class-transformer';
import { Patient } from './entities/patient.entity';

@Controller('patients')
export class PatientsController {
  constructor(private patientsService: PatientsService) {}

  @Patch(':id')
  updateDoctor(@Param('id') id: string, @Body() dto: UpdatePatientDto) {
    return this.patientsService.update(id, dto);
  }

  @Get(':id')
  async findOnePatient(@Param('id') id: string) {
    const patient = await this.patientsService.getpatientProfile(id);
    return plainToInstance(Patient, patient);
  }
  @Get()
  getAll() {
    return this.patientsService.findAll();
  }
}
