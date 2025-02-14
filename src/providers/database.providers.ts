import { Logger } from '@nestjs/common';
import { join } from 'path';
import { Sequelize } from 'sequelize-typescript';
import { envs } from 'src/config';
import { OrderItem } from 'src/orders/entities/order-item.entity';
import { Order } from 'src/orders/entities/order.entity';

const logger = new Logger('Database')

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: envs.dbHost,
        port: envs.dbPort,
        username: envs.dbUser,
        password: envs.dbPassword,
        database: envs.dbName,
        logging: false,
      });
      sequelize.addModels([Order, OrderItem]);
      await sequelize.sync();

      try {
        await sequelize.authenticate();
        logger.log(`Database running on server: ${ envs.dbHost }:${ envs.dbPort }`)
      } catch (error) {
        logger.error(`Unable to connect to the database: ${ error }`)
      }

      return sequelize;
    },
  },
];
