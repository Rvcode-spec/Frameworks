import { PartialType } from '@nestjs/mapped-types';
import { RegisterPatinetDto } from '../../auth/dto/register.patient';

export class UpdatePatientDto extends PartialType(RegisterPatinetDto) {}
