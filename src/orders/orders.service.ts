import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { OrderItemDto, OrderPaginationDto } from './dto';
import { ChangeOrderStatusDto } from './dto/change-order-status.dto';
import { NATS_SERVICE } from 'src/config';
import { firstValueFrom } from 'rxjs';
import { OrderItem } from './entities/order-item.entity';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('ORDERS_REPOSITORY') private ordersRepository: typeof Order,
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    try {
      //1. CONFIRMAR LOS VALORES
      const productIds = createOrderDto.items.map(
        (item: OrderItemDto) => item.product_id,
      );
      const products: any[] = await firstValueFrom(
        this.client.send({ cmd: 'validate_products' }, productIds),
      );

      //2. CALCULOS MATEMATICOS
      const totalAmount = createOrderDto.items.reduce(
        (acc: number, orderItem: OrderItemDto) => {
          const price = products.find(
            (product) => product.id === orderItem.product_id,
          ).price;
          return acc + price * orderItem.quantity;
        },
        0,
      );

      const totalItems = createOrderDto.items.reduce(
        (acc: number, orderItem: OrderItemDto) => {
          return acc + orderItem.quantity;
        },
        0,
      );

      return await this.ordersRepository.create({ 
        totalAmount, 
        totalItems, 
        items: createOrderDto.items.map((orderItem: OrderItemDto) =>({
          price: products.find((product) => product.id === orderItem.product_id).price,
          product_id: orderItem.product_id,
          quantity: orderItem.quantity
        }))
      }, { include: [OrderItem] });

    } catch (error) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `Some products were not found`,
      });
    }
  }

  async findAll(orderPaginationDto: OrderPaginationDto) {
    const currentPage = orderPaginationDto.page;
    const perPage = orderPaginationDto.limit;

    const { count: totalPages, rows: queryOrders } =
      await this.ordersRepository.findAndCountAll({
        where: orderPaginationDto.status
          ? { status: orderPaginationDto.status }
          : {},
        limit: perPage,
        offset: (currentPage - 1) * perPage,
      });

    return {
      data: queryOrders,
      meta: {
        total: totalPages,
        page: currentPage,
        lastPage: Math.ceil(totalPages / perPage),
      },
    };
  }

  async findOne(id: string) {
    const queryOrder = await this.ordersRepository.findByPk(id, { include: [OrderItem] });
    if (!queryOrder) {
      throw new RpcException({
        message: `Order with id: #${id} not found`,
        status: HttpStatus.NOT_FOUND,
      });
    }
    return queryOrder;
  }

  async changeStatus(changeOrderStatusDto: ChangeOrderStatusDto) {
    const queryOrder = await this.ordersRepository.findByPk(
      changeOrderStatusDto.id,
    );
    if (!queryOrder) {
      throw new RpcException({
        message: `Order with id: #${changeOrderStatusDto.id} not found`,
        status: HttpStatus.NOT_FOUND,
      });
    }
    queryOrder.update({ status: changeOrderStatusDto.status });
    return queryOrder;
  }
}
