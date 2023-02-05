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

        const date = oneEvent.dateOnly;
        const time = oneEvent.timeOnly;
        const cron = this.makeDate(date, time);

        this.queue.add('subscribe-job',{
            email: toEmail,
            title: oneEvent.title,
            description: oneEvent.description,
            date: date,
            time: time,
        },{repeat: { cron: cron } } )

        this.queue.removeRepeatable('subscribe-job', {cron : cron});
    }

    async deleteSubscription(eventId:number){
        const oneEvent = await this.noRepository.findOne({where: {id: eventId}});
        const date = oneEvent.dateOnly;
        const time = oneEvent.timeOnly;
        const cron = this.makeDate(date, time);
        await this.queue.removeRepeatable('subscribe-job', {cron: cron});
    }

    makeDate(date: string, time: string) {
        let dates = date.split('-');
        let times = time.split(':');
        let day = Number(dates[2]);
        let month = Number(dates[1]);
        let minute = Number(times[1]);
        let hour = Number(times[0]);

        if (hour == 0){ // email will be sent an hour before the event
            hour = 23
            day-=1
            if (day == 0){
                month -= 1;
            }
        }
        else
            hour-=1

        let cron = `${minute} ${hour} ${day} ${month} *`;
        console.log(cron);
        return cron;
    }
}
