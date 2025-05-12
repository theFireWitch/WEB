import { config } from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import './types/request.types';
import 'reflect-metadata';
const PORT = process.env.PORT || 3001;
//config();
//console.log('JWT_SECRET:', process.env.JWT_SECRET);
const config2: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT!) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'mydb',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
};
export default config2;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT); // порт User Service
}
bootstrap();
