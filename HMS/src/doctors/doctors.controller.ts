import { Controller, Body, Get, Patch, Param } from '@nestjs/common';
import { DoctorsService } from './doctors.service';

import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Controller('doctors')
export class DoctorsController {
  constructor(private doctorsService: DoctorsService) {}

  @Patch(':id')
  updateDoctor(@Param('id') id: string, @Body() dto: UpdateDoctorDto) {
    return this.doctorsService.update(id, dto);
  }

  @Get()
  getAll() {
    return this.doctorsService.findAll();
  }
}
