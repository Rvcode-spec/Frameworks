import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendAppointmentBookedEmail(
    to: string,
    name: string,
    slotDate: string,
    slotTime: string,
  ) {
    try {
      await this.mailerService.sendMail({
        to,
        from: process.env.MAIL_FROM || 'infowebservices2024@gmail.com',
        subject: '✅ Appointment Booked Successfully!',
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <p>Hi <strong>${name}</strong>,</p>
            <p>Your appointment has been <strong>successfully booked</strong> on:</p>
            <ul>
              <li><strong>Date:</strong> ${slotDate}</li>
              <li><strong>Time:</strong> ${slotTime}</li>
            </ul>
            <p>Thank you for using <strong>SCHEDULA</strong>!</p>
            <p style="margin-top:20px;">Regards,<br/>SCHEDULA Team</p>
          </div>
        `,
      });

      this.logger.log(`✅ Appointment email sent to ${to}`);
    } catch (error) {
      this.logger.error(
        `❌ Failed to send appointment email to ${to}`,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error.stack,
      );
      // Optionally: throw new InternalServerErrorException('Email failed');
    }
  }
}
