import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import {InjectRepository} from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EventEntity } from "../entities/event.entity";

@Injectable()
export class SubOnEventProducerService {

    constructor(
        @InjectQueue('events-queue') private queue: Queue,
        @InjectRepository(EventEntity) private noRepository: Repository<EventEntity>,
        ) {}

    async sendSubscribeMessage(eventId:number, toEmail:string) {

        const oneEvent = await this.noRepository.findOne({where: {id: eventId}});

        const date = oneEvent.dateOnly

        const time = oneEvent.timeOnly

        this.queue.add('subscribe-job',{
            email: toEmail,
            title: oneEvent.title,
            description: oneEvent.description,
            date: date,
            time: time,
        },{repeat: { cron: '* * * * *' } } )

        this.queue.removeRepeatable('subscribe-job', {cron : '* * * * *'});
    }
}
