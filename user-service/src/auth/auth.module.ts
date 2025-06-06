import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
//import { AuthService } from './auth.service';
//import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
      UsersModule,
      JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '3600s' },
        }),
      }),
    ],
    //providers: [AuthService],
    //controllers: [AuthController],
    //exports: [AuthService], // If other modules need AuthService
  })
export class AuthModule {}