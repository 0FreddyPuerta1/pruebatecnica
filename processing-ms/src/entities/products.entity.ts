import { Column, DataType, Model, Table } from 'sequelize-typescript';

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
export class Products extends Model {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  price!: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description!: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  images!: string[];
}
