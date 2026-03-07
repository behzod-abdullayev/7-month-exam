import { Module } from "@nestjs/common";
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from "@nestjs/typeorm"; 
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { User } from "../users/entities/user.entity"; 
import { JwtStrategy } from "./strategies/jwt.strategy";
import { GoogleStrategy } from "./strategies/google.strategy";
import { GithubStrategy } from "./strategies/github.strategy";
import { UserModule } from "./user/user.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]), 
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                const secret = config.get<string>("jwt.accessSecret");
                const expiresIn = config.get<string>("jwt.accessExpiresIn");

                return {
                    secret: secret,
                    signOptions: { 
                        expiresIn: expiresIn as any 
                    }
                };
            }
        }),
        UserModule
    ],
    controllers: [AuthController],
    providers: [
        AuthService, 
        JwtStrategy, 
        GoogleStrategy, 
        GithubStrategy
    ],
    exports: [AuthService]
})
export class AuthModule {}