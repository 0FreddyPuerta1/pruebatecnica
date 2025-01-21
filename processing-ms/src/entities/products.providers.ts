import { PRODUCTS } from 'src/constants';
import { Products } from './products.entity';

export const productsProviders = [{ provide: PRODUCTS, useValue: Products }];
