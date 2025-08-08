import { PartialType } from '@nestjs/mapped-types';
import { RegisterDoctorDto } from '../../auth/dto/register.doctro';

export class UpdateDoctorDto extends PartialType(RegisterDoctorDto) {}
