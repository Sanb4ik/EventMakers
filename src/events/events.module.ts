import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Events} from "./entities/events.entity";
import {OneEvent} from "./entities/oneEvent.entity";
import {Users} from "../users/entities/user.entity";
import {BullModule} from "@nestjs/bull";
import {SubOnEventProducerService} from "./subOnEvent.producer.service";
import {SubOnEventConsumerService} from "./subOnEvent.consumer.service";
@Module({
  imports: [
    BullModule.registerQueue({
      name:'events-queue'
    }),
    TypeOrmModule.forFeature([OneEvent]),
    TypeOrmModule.forFeature([Events]),
    TypeOrmModule.forFeature([Users])
  ],
  controllers: [EventsController],
  providers: [EventsService, SubOnEventProducerService, SubOnEventConsumerService]

})
export class EventsModule {}
