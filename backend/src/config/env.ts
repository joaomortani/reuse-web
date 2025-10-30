import dotenv from 'dotenv';

dotenv.config();

const env = {
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
  databaseUrl: process.env.DATABASE_URL ?? '',
};

export default env;
