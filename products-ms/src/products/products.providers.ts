import { PRODUCTS } from 'src/constants';
import { Product } from './products.model';

export const productProviders = [{ provide: PRODUCTS, useValue: Product }];
