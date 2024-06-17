import {
  Controller,
  Get,
  Post,
  Body,
  Inject,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
  HttpCode,
  Injectable,
  Scope,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './db/user.service';
import { S3Service } from './s3/s3.service';
import { AuthService } from './auth/auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from './auth/auth.guard';

import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { GalleryService } from './db/gallery.service';

@Controller()
@Injectable({ scope: Scope.REQUEST })
export class AppController {
  constructor(
    @Inject(REQUEST) private request: Request,
    private readonly appService: AppService,
    private readonly userService: UserService,
    private readonly s3Service: S3Service,
    private readonly authService: AuthService,
    private readonly galleryService: GalleryService,
  ) {}

  // hello world route
  @UseGuards(AuthGuard)
  @Get()
  async greet() {
    console.log('user :', this.request['user']);
    const users = this.userService.findAll();
    return users;
  }

  @UseGuards(AuthGuard)
  @Get('pics')
  async getAllMyUploadedPictures() {
    const userId = this.request['user']?.userId;
    const pics = this.galleryService.find({ userId });
    if (!pics || !pics.length) {
      return { msg: 'No pics found' };
    }
    for (const file of pics) {
      file.url = await this.s3Service.getSignedUrl(file.key);
    }
    return { data: pics };
  }

  // user register
  @Post('register')
  async register(@Body() body: any) {
    const { email, name, password } = body;
    const isExists = this.userService.find({ email })[0];
    if (isExists) {
      throw new HttpException(
        `User already registered.`,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const createdUser = this.userService.add(body);
    return createdUser;
  }

  // user login
  // returns JWT token
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() body: any) {
    const { email, password } = body;
    const createdUser = await this.authService.signIn(email, password);
    return createdUser;
  }

  // user can upload pics
  @UseGuards(AuthGuard)
  @Post('uploadPic')
  //   @UseInterceptors(FileInterceptor('file'))
  // adding validations
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(
            new HttpException(
              'Only image files are allowed!',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const fileName = `${Date.now()}-${file.originalname}`;
    const url = await this.s3Service.uploadFile(fileName, file, this.request);
    return { url };
  }
}
