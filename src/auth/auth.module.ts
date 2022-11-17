import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Refresh_tokens } from './entitys/tokens.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule, 
    TypeOrmModule.forFeature([Refresh_tokens]), 
    JwtModule.register({})
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
