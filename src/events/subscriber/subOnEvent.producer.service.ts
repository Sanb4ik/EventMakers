import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import {InjectRepository} from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EventEntity } from "../entities/event.entity";
import {EventSubscribers} from "../entities/eventSubscribers.entity";

@Injectable()
export class SubOnEventProducerService {

    constructor(
        @InjectQueue('events-queue') private queue: Queue,
        @InjectRepository(EventEntity) private eventRepository: Repository<EventEntity>,

        @InjectRepository(EventSubscribers) private subscribersRepository: Repository<EventSubscribers>,
        ) {}

    async sendSubscribeMessage(userId: number, eventId: number, toEmail: string) {

        const oneEvent = await this.eventRepository.findOne({where: {id: eventId}});

        const date = oneEvent.dateOnly;
        const time = oneEvent.timeOnly;
        const cron = this.makeCron(date, time);

        const bullJob = await this.queue.add('subscribe-job', {
            email: toEmail,
            title: oneEvent.title,
            description: oneEvent.description,
            date: date,
            time: time,
            eventId: eventId,
            userId: userId
        }, {repeat: {cron: cron}})

        console.log(bullJob.id)
        const subscribeEvent = await this.subscribersRepository.findOneBy({usersId: userId, eventId: eventId})
        subscribeEvent.jobId = `${bullJob.id}`
        await this.subscribersRepository.save(subscribeEvent)

    }

    async deleteSubscription(bullJobId: string){
        console.log(bullJobId)
        let jobs = await this.queue.getJobs(['delayed']);
        let jobToDelete = jobs.find((delayedJob)=> delayedJob.opts.jobId == bullJobId);
        if(jobToDelete){
            await jobToDelete.remove()
            await this.queue.removeRepeatableByKey(jobToDelete.lockKey())
        }
    }

    async  deleteJobAfterCompleted(bullJobId: string){
        let activeJobs = await this.queue.getJobs(['delayed']);
        let activeJobToDelete = await activeJobs.find((delayedJob)=>delayedJob.opts.jobId.toString().includes(bullJobId.split(':')[1]));
        console.log(activeJobToDelete.opts.jobId)
        if(activeJobToDelete){
            await activeJobToDelete.remove()
            await this.queue.removeRepeatableByKey(activeJobToDelete.lockKey())
        }
        console.log(activeJobToDelete.opts.jobId, 'was deleted')
    }


    makeCron(date: string, time: string) {
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

        return `${minute} ${hour} ${day} ${month} *`;
    }
}
