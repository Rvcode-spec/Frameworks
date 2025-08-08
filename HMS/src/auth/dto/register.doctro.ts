import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDoctorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  specialization: string;
}
