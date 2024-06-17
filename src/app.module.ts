import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { S3Service } from './s3/s3.service';
import { UserService } from './db/user.service';
import { GalleryService } from './db/gallery.service';
import { AuthService } from './auth/auth.service';

import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/secret';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1800s' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, UserService, GalleryService, S3Service, AuthService],
})
export class AppModule {}
