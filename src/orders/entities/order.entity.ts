import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { OrderStatus } from '../enum/order.enum';
import { OrderItem } from './order-item.entity';
import { UUIDV4 } from 'sequelize';


@Table({
  timestamps: true,
  tableName: "order",
  paranoid: true,
  freezeTableName: true,
})
export class Order extends Model {

  @Column({ type: DataType.UUID, defaultValue: UUIDV4(), allowNull: false, primaryKey: true })
  id: string;

  @Column
  totalAmount: number;

  @Column
  totalItems: number;

  @Column({ type: DataType.ENUM(...Object.values(OrderStatus)), defaultValue: OrderStatus.PENDING  })
  status: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  paid: boolean;

  @Column({type: DataType.DATE, allowNull: true })
  paidAt: Date;


  @HasMany(() => OrderItem)
  items: OrderItem[];

}