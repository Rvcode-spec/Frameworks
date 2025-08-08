import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { ShiftType } from '../entities/enums/shift.enum';

export class UpdateSlotDto {
  @IsNotEmpty()
  @IsString()
  date: string;

  @IsNotEmpty()
  @IsString()
  startTime: string;

  @IsNotEmpty()
  @IsString()
  endTime: string;

  @IsEnum(ShiftType)
  shift: ShiftType;

  @IsNotEmpty()
  doctorId: string;
}
