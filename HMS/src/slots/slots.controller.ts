import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { SlotsService } from './slots.service';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update.slot.dto';

@Controller('slots')
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Post()
  create(@Body() createSlotDto: CreateSlotDto) {
    return this.slotsService.create(createSlotDto);
  }

  @Get()
  findAll() {
    return this.slotsService.findAll();
  }

  @Get('doctor/:id')
  getSlotsByDoctor(@Param('id') doctorId: string) {
    return this.slotsService.findAvailableSlotsByDoctor(doctorId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSlotDto) {
    return this.slotsService.update(id, dto);
  }

  @Patch(':id/unavailable')
  markUnavailable(@Param('id') id: string) {
    return this.slotsService.markUnavailable(id);
  }
}
