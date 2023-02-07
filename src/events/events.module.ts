import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Users} from "../users/entities/user.entity";
import {BullModule} from "@nestjs/bull";
import {SubOnEventProducerService} from "./subscriber/subOnEvent.producer.service";
import {SubOnEventConsumerService} from "./subscriber/subOnEvent.consumer.service";
import {SendgridService} from "./subscriber/sendEmail.service";
import {EventEntity} from "./entities/event.entity";
import {EventSubscribers} from "./entities/eventSubscribers.entity";
import { SubscriberController } from './subscriber/subscriber.controller';
import { SubscriberService } from './subscriber/subscriber.service';
@Module({
  imports: [
    BullModule.registerQueue({
      name:'events-queue'
    }),
    TypeOrmModule.forFeature([Users, EventEntity, EventSubscribers]),
  ],
  controllers: [EventsController, SubscriberController],
  providers: [EventsService, SubOnEventProducerService, SubOnEventConsumerService, SendgridService, SubscriberService]

})
export class EventsModule {}
