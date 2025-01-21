import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  ListObjectsCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { PRODUCTS } from './constants';
import { Products } from './entities/products.entity';
import { Product } from './interfaces/product.interface';

@Injectable()
export class AppService {
  constructor(
    private configService: ConfigService,
    @Inject(PRODUCTS) private readonly productsRepository: typeof Products,
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

  async runTask(): Promise<void> {
    const files = await this.getFiles();
    for (const file of files) {
      const fileContent = await this.getFile(file.Key);
      const uniqueProducts = Array.from(
        new Map(fileContent.map((p) => [`${p.title}`, p])).values(),
      );
      for (const product of uniqueProducts) {
        const productData: Product = {
          title: product.title,
          price: product.price,
          description: product.description,
          images: product.images ? product.images : [product.image],
        };

        await this.saveProductOnDb(productData);
      }
    }
  }

  private async saveProductOnDb(productData: Product) {
    try {
      const [productRecord, created] =
        await this.productsRepository.findOrCreate({
          where: { title: productData.title },
          defaults: { ...productData },
        });

      if (created) {
        console.log('Producto creado: ', productRecord.title);
      } else {
        console.log('Producto ya existe: ', productRecord.title);
      }
    } catch (error) {
      console.error('Error al guardar producto: ', error);
    }
  }

  private async getFiles() {
    const command = new ListObjectsCommand({
      Bucket: this.AWS_BUCKET_NAME,
    });
    const result = await this.s3.send(command);
    return result.Contents;
  }

  private async getFile(key: string) {
    const command = new GetObjectCommand({
      Bucket: this.AWS_BUCKET_NAME,
      Key: key,
    });
    const result = await this.s3.send(command);
    const streamToString = (stream): Promise<string> =>
      new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      });

    const fileContent = await streamToString(result.Body as Readable);

    try {
      const dataArray: any[] = JSON.parse(fileContent);
      return dataArray;
    } catch (error) {
      console.error('Error parseando JSON: ', error);
      throw new Error('Invalid JSON format');
    }
  }
}
