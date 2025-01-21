import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './products.model';
import { PRODUCTS } from 'src/constants';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(PRODUCTS) private readonly productModel: typeof Product,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productModel.findAll();
  }

  async findOne(id: number): Promise<Product> {
    return this.productModel.findByPk(id);
  }
}
