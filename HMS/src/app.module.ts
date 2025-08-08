import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import databaseConfig from './congif/config.module';
import { AuthModule } from './auth/auth.module';
import { DoctorsModule } from './doctors/doctors.module';
import { PatientsModule } from './patients/patients.module';
import { SlotsModule } from './slots/slots.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail/mail.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // ✅ TypeORM config
    TypeOrmModule.forRootAsync({
      useFactory: databaseConfig,
    }),

    // ✅ Mailer config (with self-signed cert fix)
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false, // ✅ FIX for self-signed cert error
        },
      },
      defaults: {
        from:
          process.env.MAIL_FROM || '"Schedula" <infowebservices2024@gmail.com>',
      },
    }),

    // ✅ Application modules
    AuthModule,
    DoctorsModule,
    PatientsModule,
    SlotsModule,
    AppointmentsModule,
  ],
  providers: [MailService],
  exports: [MailService],
})
export class AppModule {}
