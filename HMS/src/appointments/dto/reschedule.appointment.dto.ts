import { IsUUID } from 'class-validator';

export class RescheduleAppointmentDto {
  @IsUUID()
  newSlotId: string;
}
