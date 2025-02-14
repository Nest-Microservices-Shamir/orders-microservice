import { UUIDV4 } from 'sequelize';
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Order } from './order.entity';

@Table({
  timestamps: true,
  tableName: 'order_item',
  paranoid: true,
  freezeTableName: true,
})
export class OrderItem extends Model {

  @Column({ type: DataType.UUID, defaultValue: UUIDV4(), primaryKey: true })
  id: string;

  @Column
  product_id: number;

  @Column
  quantity: number;

  @Column
  price: number;

  @ForeignKey(() => Order)
  @Column({ type: DataType.UUID })
  order_id: string;

  
  @BelongsTo(() => Order)
  order: Order;

}
