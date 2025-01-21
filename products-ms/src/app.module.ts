import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ProductsModule } from './products/products.module';
import { ConfigModule } from '@nestjs/config';
import { databaseProviders } from './database.providers';
import { productProviders } from './products/products.providers';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    ProductsModule,
  ],
  controllers: [],
  providers: [...databaseProviders, ...productProviders],
})
export class AppModule {}
