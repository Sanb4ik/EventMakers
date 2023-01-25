import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Events} from "./entities/events.entity";
import {OneEvent} from "./entities/oneEvent.entity";
import {Users} from "../users/entities/user.entity";

@Injectable()
export class EventsService {

  constructor(
  @InjectRepository(Events) private eventsRepository: Repository<Events>,
  @InjectRepository(OneEvent) private oneEventRepository: Repository<OneEvent>,
  @InjectRepository(Users) private usersRepository: Repository<Users>
  ) {}
  async create(createEventDto: CreateEventDto, userId) {
    let date = new Date();
    createEventDto.dateOnly = date.getFullYear()+ "-" + (date.getMonth()+1) + "-" + date.getDate();
    createEventDto.timeOnly = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    console.log(createEventDto);
    const event =  await this.oneEventRepository.save(createEventDto)
    const user = await this.usersRepository.save({id: userId})
    await this.eventsRepository.save({event, user});


    return event;
  }

  async findAll(userId: number) {
    console.log(userId);
    const user_events =  await this.eventsRepository.find({
      relations:{
        event:true,
      },
      where: {
        user:{
          id: userId
        }
      }
    });

    return user_events;
  }

  async remove(id: number, userId: number) {
    const user_events =  await this.eventsRepository.findOne({
      relations:{
        event:true,
      },
      where: {
        user: {
          id: userId
        },
        event: {
          id: id
        }
      }
    });
    if (user_events){
      await this.eventsRepository.delete(user_events);
      await this.oneEventRepository.delete(user_events.event);
    }

    return user_events;
  }

  async findOne(id: number, userId: number) {
    const user_events =  await this.eventsRepository.findOne({
      relations:{
        event:true,
      },
      where: {
        user: {
          id: userId
        },
        event: {
          id: id
        }
      }
    });
    return user_events;
  }
}
