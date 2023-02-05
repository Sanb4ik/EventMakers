import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule} from '@nestjs/config'
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { configuration } from '../config/configuration';
import { EventsModule } from './events/events.module';
import {BullModule} from "@nestjs/bull";


console.log(process.env.NODE_ENV);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/config/env/${process.env.NODE_ENV}.env`,
      load: [configuration],
      isGlobal: true,
    }),

    BullModule.forRoot({
      redis: {
        host: `${process.env.REDIS_HOST}`,
        port: Number(`${process.env.REDIS_PORT}`),
      },
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: `${process.env.POSTGRES_HOST}`,
      port: Number(`${process.env.POSTGRES_PORT}`),
      username: 'postgres',
      password: 'master',
      database: 'event-makers',
      entities: ['dist/**/*.entity.js'],
      synchronize: true,
      autoLoadEntities: true,
      
    }),
    AuthModule,
    UsersModule,
    EventsModule
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
