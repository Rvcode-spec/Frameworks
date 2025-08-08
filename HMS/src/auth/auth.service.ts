import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { DoctorsService } from '../doctors/doctors.service';
import { PatientsService } from '../patients/patients.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly doctorsService: DoctorsService,
    private readonly patientsService: PatientsService,
  ) {}

  async validateUser(email: string, password: string) {
    const doctor = await this.doctorsService.findByEmail(email);
    const patient = await this.patientsService.findByEmail(email);

    const user = doctor || patient;
    if (!user) throw new UnauthorizedException('Invalid email or password');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid password');

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);

    const token = this.jwtService.sign({
      id: user.id,
      role: user.role, // Ensure both doctor/patient entities have `role`
    });

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }
}
