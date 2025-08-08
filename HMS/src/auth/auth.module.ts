import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config'; // 👈 Add this
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { jwtStrategy } from './jwt.strategy';

import { DoctorsModule } from '../doctors/doctors.module';
import { PatientsModule } from '../patients/patients.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // 👈 Load env vars
    DoctorsModule,
    PatientsModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      // eslint-disable-next-line @typescript-eslint/require-await
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // ✅ Secure & dynamic
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, jwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
