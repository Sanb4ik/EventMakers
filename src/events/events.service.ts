import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {Users} from "../users/entities/user.entity";
import {EventEntity} from "./entities/event.entity";
import {EventSubscribers} from "./entities/eventSubscribers.entity";


@Injectable()
export class EventsService {

  constructor(
  @InjectRepository(EventEntity) private eventRepository: Repository<EventEntity>,
  @InjectRepository(EventSubscribers)private subscribersRepository: Repository<EventSubscribers>,
  @InjectRepository(Users) private usersRepository: Repository<Users>
  ) {}
  async create(createEventDto: CreateEventDto, userId: number){

    const user = await this.usersRepository.findOneBy({id: userId});

    const existingEvent = await this.eventRepository.findOneBy({
      title: createEventDto.title,
      description: createEventDto.description,
      dateOnly: createEventDto.dateOnly,
      timeOnly: createEventDto.timeOnly,
      user: user
    });

    if(!existingEvent){
      const event = await this.eventRepository.save({
        ...createEventDto,
        user: user,
        followers: []
      });

      await this.subscribersRepository.save({
        usersId: userId,
        eventId: event.id
      });

      return event;
    }

    return 'this event already exists';
  }

  async findAll(userId: number) {

    const user = await this.usersRepository.findOneBy({id: userId})
    const user_events =  await this.eventRepository.find({
      where: {
          user: user
         }
    });

    return user_events;
  }

  async removeOne(eventId: number, userId: number) {
    const user = await this.usersRepository.findOneBy({id: userId})
    const user_events =  await this.eventRepository.findOne({
      where: {
        id: eventId,
        user: user
      }
    });

    if (user_events){
      await this.eventRepository.delete(user_events);
    }

    return user_events;
  }

  async findOne(eventId: number, userId: number) {
    const user = await this.usersRepository.findOneBy({id: userId})
    return  await this.eventRepository.findOneBy({id: eventId, user: user});
  }
}
