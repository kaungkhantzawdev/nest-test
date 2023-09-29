import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import path = require('path');

const date = new Date();
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './photos',
        filename: (req, file, cb) => {
          const filename: string =
            path.parse(file.originalname).name.replace(/\s/g, '') +
            '_photo_' +
            date.getTime();
          const extname: string = path.parse(file.originalname).ext;

          cb(null, `${filename}${extname}`);
        },
      }),
    }),
  )
  @Post('/upload')
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('file', file);
    return { img_path: file.filename };
  }
}
