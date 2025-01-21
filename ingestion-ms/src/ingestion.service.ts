import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { API_ENDPOINTS } from './api-endpoints';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
@Injectable()
export class IngestionService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  AWS_BUCKET_NAME = this.configService.get('AWS_BUCKET_NAME');
  AWS_REGION = this.configService.get('AWS_REGION');
  AWS_KEY = this.configService.get('AWS_KEY');
  AWS_SECRET_KEY = this.configService.get('AWS_SECRET_KEY');
  PROCESSING_MS_URL = this.configService.get('PROCESSING_MS_URL');

  s3 = new S3Client({
    region: this.AWS_REGION,
    credentials: {
      accessKeyId: this.AWS_KEY,
      secretAccessKey: this.AWS_SECRET_KEY,
    },
  });

  //@Cron('0 0 * * 1')
  @Cron('10 * * * * *')
  private async runTask() {
    try {
      for (const apiEndpoint of API_ENDPOINTS) {
        const data = await this.fetchData(apiEndpoint.url);
        await this.uploadData(data, apiEndpoint.filename);
      }
      await this.notifyTaskCompletion();
    } catch (error) {
      console.error('Error ejecutando runTask: ', error.message);
    }
  }

  private async fetchData(url: string) {
    const response = await axios.get(url);
    return response;
  }

  private async uploadData(data: AxiosResponse, filename: string) {
    const dataString = JSON.stringify(data.data);

    const uploadParams = {
      Bucket: this.AWS_BUCKET_NAME,
      Key: filename,
      Body: dataString,
    };
    const command = new PutObjectCommand(uploadParams);
    await this.s3.send(command);
  }

  private async notifyTaskCompletion() {
    console.log(this.PROCESSING_MS_URL);
    console.log('enviando mensaje');
    try {
      await firstValueFrom(
        this.httpService.post(this.PROCESSING_MS_URL, {
          message: 'Upload success',
          timestamp: new Date(),
        }),
      );
    } catch (error) {
      console.error(error.message);
    }
  }
}
