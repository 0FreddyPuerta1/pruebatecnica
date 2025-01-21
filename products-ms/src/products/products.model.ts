import { Field, ObjectType, Int, Float } from '@nestjs/graphql';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

@ObjectType()
@Table({
  tableName: 'PRODUCTS',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['title'],
    },
  ],
})
export class Product extends Model {
  @Field(() => Int)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Field()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;

  @Field(() => Float)
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  price!: number;

  @Field({ nullable: true })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @Field(() => [String], { nullable: true })
  @Column({
    type: DataType.JSON,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('images');
      return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
    },
    set(value: string[] | string) {
      this.setDataValue('images', JSON.stringify(value));
    },
  })
  images?: string[];
}
