import { IsNumber, IsPositive, IsUUID } from 'class-validator';

export class OrderItemDto {
  @IsUUID()
  product_id: string;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  price: number;
}
