import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { databaseProviders } from './providers';
import { NatsModule } from './transports/nats.module';


@Module({
  imports: [OrdersModule, NatsModule],
  controllers: [],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class AppModule {}
