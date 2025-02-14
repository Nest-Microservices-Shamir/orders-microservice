import { IsEnum, IsOptional } from "class-validator";
import { PaginationDto } from "src/common";
import { OrderStatus } from "../enum/order.enum";

export class OrderPaginationDto extends PaginationDto{

    @IsOptional()
    @IsEnum(OrderStatus, { 
		message: `Possible status values are: ${Object.values(OrderStatus)}` 
	})
  	status: OrderStatus;

}