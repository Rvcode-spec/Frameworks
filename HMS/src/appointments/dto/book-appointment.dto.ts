import {
  IsUUID,
  IsBoolean,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';

export class BookAppointmentDto {
  @IsUUID()
  patientId: string;

  @IsUUID()
  slotId: string;

  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  appointmentTime?: string;

  @IsOptional()
  @IsBoolean()
  isEmergency?: boolean;
}
