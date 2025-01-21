import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE } from './constants';
import { ConfigService } from '@nestjs/config';
import { Products } from './entities/products.entity';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const DB_NAME = configService.get<string>('DB_NAME');
      const DB_PASSWORD = configService.get<string>('DB_PASSWORD');
      const DB_USER = configService.get<string>('DB_USER');
      const DB_HOST = configService.get<string>('DB_HOST');
      const DB_PORT = configService.get<number>('DB_PORT');
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: DB_HOST,
        port: DB_PORT || 3306,
        username: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
        logging: false,
      });
      sequelize.addModels([Products]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
