import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendOtpEmail(email: string, otpCode: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Tasdiqlash kodi - HH.uz',
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
            <h2 style="color: #333;">Salom!</h2>
            <p>Sizning hh.uz tizimi uchun tasdiqlash kodingiz:</p>
            <h1 style="color: #007bff; letter-spacing: 5px;">${otpCode}</h1>
            <p style="color: #666; font-size: 12px;">Ushbu kod 5 daqiqa davomida amal qiladi.</p>
          </div>
        `,
      });
      return true;
    } catch (error) {
      this.logger.error(`Email yuborishda xatolik (${email}): ${error.message}`);
      return false;
    }
  }
}