import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Events} from "./entities/events.entity";
import {OneEvent} from "./entities/oneEvent.entity";
import {Users} from "../users/entities/user.entity";
@Module({
  imports: [
    TypeOrmModule.forFeature([OneEvent]),
    TypeOrmModule.forFeature([Events]),
    TypeOrmModule.forFeature([Users])
  ],
  controllers: [EventsController],
  providers: [EventsService]

})
export class EventsModule {}
