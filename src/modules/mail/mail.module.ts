import { Module, Global } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { ConfigService, ConfigModule } from '@nestjs/config'; 

@Global() 
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule], 
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true, 
          auth: {
            user: 'behzod2366@gmail.com',
            pass: config.get<string>('APP_KEY'), 
          },
        },
        defaults: {
          from: '"HH.uz Support" <behzod2366@gmail.com>',
        },
      }), 
      inject: [ConfigService], 
    }),
  ],
  providers: [MailService],
  exports: [MailService],
}) 
export class MailModule {}