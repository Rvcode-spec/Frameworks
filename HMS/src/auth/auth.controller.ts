import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDoctorDto } from './dto/register.doctro';
import { RegisterPatinetDto } from './dto/register.patient';
import { DoctorsService } from '../doctors/doctors.service';
import { PatientsService } from '../patients/patients.service';
import { jwtStrategy } from '../auth/jwt.strategy';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private doctorService: DoctorsService,
    private patientService: PatientsService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('register/doctor')
  async registerDoctor(@Body() dto: RegisterDoctorDto) {
    return this.doctorService.register(dto);
  }

  @Post('register/patient')
  async registerPatient(@Body() dto: RegisterPatinetDto) {
    return this.patientService.register(dto);
  }

  @Post('patient/logout')
  logoutPatient() {
    return { message: 'Logout successful' };
  }

  @Post('doctor/logout')
  logoutdoctor() {
    return { message: 'Logout successful' };
  }

  @Get('patient')
  getAllPatients() {
    return this.patientService.findAll();
  }

  @UseGuards(jwtStrategy)
  @Get('patient/profile')
  getpatientProfile(@Req() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const userId = req.user.id;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.patientService.getpatientProfile(userId);
  }

  @UseGuards(jwtStrategy)
  @Get('doctor/profile')
  getdoctorProfile(@Req() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const userId = req.user.id;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.doctorService.getdoctorProfile(userId);
  }
}
