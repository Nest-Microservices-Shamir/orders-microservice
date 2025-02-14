import { IsEnum, IsUUID } from "class-validator";
import { OrderStatus } from "../enum/order.enum";


export class ChangeOrderStatusDto{

    @IsUUID(4)
    id: string

    @IsEnum(OrderStatus, { message: `Possible status values are: ${OrderStatus}` })
  	status: OrderStatus = OrderStatus.PENDING;
}