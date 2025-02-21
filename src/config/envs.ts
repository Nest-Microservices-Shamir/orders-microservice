import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  //DATABASE
  POSTGRES_URL: string;
  //NATS SERVICE
  NATS_SERVERS: string[];
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    //DATABASE
    POSTGRES_URL: joi.string().required(),
    //NATS SERVICE
    NATS_SERVERS: joi.array().items(joi.string()).required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});

if (error) {
  console.error('Config validation error(s):');
  error.details.forEach((detail) => {
    console.error(`----> ${detail.message}`);
  });
  throw new Error('Environment variables validation failed.');
}

const envVars: EnvVars = value;


export const envs = {
  port: envVars.PORT,
  //DATABASE
  postgresUrl: envVars.POSTGRES_URL,
  //NATS SERVICE
  natsServers: envVars.NATS_SERVERS,
};
