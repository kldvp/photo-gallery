import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';

import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { GalleryService } from 'src/db/gallery.service';
import { Request } from 'express';

@Injectable()
export class S3Service {
  private s3Client: S3Client;

  constructor(
    private configService: ConfigService,
    private galleryService: GalleryService,
  ) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  async uploadFile(
    fileName: string,
    file: Express.Multer.File,
    request: Request,
  ): Promise<string> {
    const bucketName = this.configService.get<string>('S3_BUCKET_NAME');
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);
    const uploadedFileInfo = {
      key: fileName,
      filename: file.originalname,
      uploadedAt: Date.now(),
      userId: request['user']?.id,
    };
    this.galleryService.add(uploadedFileInfo);

    return `https://${bucketName}.s3.${this.configService.get<string>('AWS_REGION')}.amazonaws.com/${fileName}`;
  }

  async getSignedUrl(fileName: string): Promise<string> {
    const bucketName = this.configService.get<string>('S3_BUCKET_NAME');
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileName,
    });
    const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    return url;
  }
}
