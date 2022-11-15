import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'master',
      database: 'event-makers',
      entities: ['dist/**/*.entity.js'],
      synchronize: true,
    }),
    AuthModule,
    UsersModule
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
