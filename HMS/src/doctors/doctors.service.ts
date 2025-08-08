import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './entities/doctor.entity';
import { RegisterDoctorDto } from '../auth/dto/register.doctro'; // ✅ Fix typo
import * as bcrypt from 'bcrypt';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepo: Repository<Doctor>,
  ) {}

  async register(registerDto: RegisterDoctorDto): Promise<Doctor> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const newDoctor = this.doctorRepo.create({
      ...registerDto,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      password: hashedPassword,
    });

    return this.doctorRepo.save(newDoctor);
  }

  async getdoctorProfile(userId: string) {
    return this.doctorRepo.findOne({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
        gender: true,
      },
    });
  }

  async findByEmail(email: string): Promise<Doctor | null> {
    return this.doctorRepo.findOne({ where: { email } });
  }

  async update(id: string, dto: UpdateDoctorDto) {
    const doctor = await this.doctorRepo.findOne({ where: { id } });
    if (!doctor) throw new NotFoundException('Doctor not found');
    Object.assign(doctor, dto);
    return this.doctorRepo.save(doctor);
  }

  async findAll(): Promise<Doctor[]> {
    return this.doctorRepo.find();
  }
}
