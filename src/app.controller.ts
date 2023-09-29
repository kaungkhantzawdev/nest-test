import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
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
        destination: './photos/single',
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

  @UseInterceptors(
    FilesInterceptor('photos', 3, {
      storage: diskStorage({
        destination: './photos/multiple',
        filename: (req, file, cb) => {
          const filename: string =
            path.parse(file.originalname).name.replace(/\s/g, '') +
            '_photos_' +
            date.getTime();
          const extname: string = path.parse(file.originalname).ext;

          cb(null, `${filename}${extname}`);
        },
      }),
    }),
  )
  @Post('/uploads')
  uploaded(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log('file', files);
  }

  @Post('upload-multiple')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'avatar', maxCount: 1 },
        { name: 'background', maxCount: 3 },
      ],
      {
        storage: diskStorage({
          destination: './photos/multiple-photos',
          filename: (req, file, cb) => {
            const filename: string =
              path.parse(file.originalname).name.replace(/\s/g, '') +
              '_multiple_' +
              date.getTime();
            const extname: string = path.parse(file.originalname).ext;

            cb(null, `${filename}${extname}`);
          },
        }),
      },
    ),
  )
  uploadFileMultiple(
    @UploadedFiles()
    files: {
      avatar?: Express.Multer.File[];
      background?: Express.Multer.File[];
    },
  ) {
    console.log(files);
  }
}
