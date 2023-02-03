import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {EventSubscribers} from "../entities/eventSubscribers.entity";
import {Repository} from "typeorm";
import {EventEntity} from "../entities/event.entity";
import {SubOnEventProducerService} from "./subOnEvent.producer.service";

@Injectable()
export class SubscriberService {

    constructor(
        @InjectRepository(EventSubscribers)private subscribersRepository: Repository<EventSubscribers>,
        @InjectRepository(EventEntity) private eventRepository: Repository<EventEntity>,
        private subOnEventProducerService:SubOnEventProducerService,
    ){}
    async subscribeToEvent(eventId: number, userId: number, toEmail: string) {

        const eventCreator = await this.subscribersRepository.findOneBy({usersId: userId, eventId: eventId});

        const event = await this.eventRepository.findOne({
            where:{
                id: eventId,
            }
        });

        if(!eventCreator && event){
            event.subscribers +=1;
            await this.eventRepository.save(event);

            await this.subscribersRepository.save({
                usersId: userId,
                noEntityId: eventId
            });

            await this.subOnEventProducerService.sendSubscribeMessage(eventId, toEmail);
            return `you have subscribed to an event ${event.title}`;
        }
        return `you already subscribed to an event or event doesn't exist`;
    }
}
