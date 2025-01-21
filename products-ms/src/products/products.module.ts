import { Module } from '@nestjs/common';
import { ProductsResolver } from './products.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductsService } from './products.service';
import { databaseProviders } from 'src/database.providers';
import { productProviders } from './products.providers';

@Module({
  providers: [
    ProductsResolver,
    ProductsService,
    ...productProviders,
    ...databaseProviders,
  ],
})
export class ProductsModule {}
