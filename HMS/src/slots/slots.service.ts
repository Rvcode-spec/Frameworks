import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Slot } from './entities/slot.entity';
import { Repository } from 'typeorm';
import { CreateSlotDto } from './dto/create-slot.dto';
import { Doctor } from '../doctors/entities/doctor.entity';
import { UpdateSlotDto } from './dto/update.slot.dto';

@Injectable()
export class SlotsService {
  constructor(
    @InjectRepository(Slot)
    private slotRepository: Repository<Slot>,

    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
  ) {}

  async create(createSlotDto: CreateSlotDto): Promise<Slot> {
    const doctor = await this.doctorRepository.findOne({
      where: { id: createSlotDto.doctorId },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const slot = this.slotRepository.create({
      date: createSlotDto.date,
      startTime: createSlotDto.startTime,
      endTime: createSlotDto.endTime,
      isAvailable: true,
      shift: createSlotDto.shift,
      doctor,
    });

    return await this.slotRepository.save(slot);
  }

  async findAll(): Promise<Slot[]> {
    return this.slotRepository.find({ relations: ['doctor'] });
  }

  async findAvailableSlotsByDoctor(doctorId: string): Promise<Slot[]> {
    return this.slotRepository.find({
      where: {
        doctor: {
          id: doctorId,
        },
        isAvailable: true,
      },
      relations: ['doctor'],
    });
  }

  async update(id: string, dto: UpdateSlotDto): Promise<Slot> {
    const slot = await this.slotRepository.preload({
      id,
      ...dto,
    });
    if (!slot) throw new NotFoundException('Slot not found');
    return this.slotRepository.save(slot);
  }

  async markUnavailable(slotId: string): Promise<Slot> {
    const slot = await this.slotRepository.findOne({ where: { id: slotId } });
    if (!slot) throw new NotFoundException('Slot not found');
    console.log('Max bookings from DB:', slot.maxBookingsPerSlot);
    slot.isAvailable = false;
    return this.slotRepository.save(slot);
  }
}
