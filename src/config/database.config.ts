import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: (process.env.DB_TYPE as 'postgres') || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'chat_app',
  autoLoadEntities: Boolean(process.env.DB_AUTOLOADENTITIES),
  synchronize: Boolean(process.env.DB_SYNCHRONIZE),
}));
