import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './module/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'admin',
      database: 'develop',
      entities: [__dirname + '/../**/*.entity.js'],
      ssl: false,
      synchronize: true,
    }),
    ConfigModule.forRoot(),
  ],
})
export class AppModule {}
