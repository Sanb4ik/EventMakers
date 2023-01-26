import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class SubOnEventProducerService {
    constructor(@InjectQueue('events-queue') private queue: Queue) {}

    sendMessage(message:string){
        this.queue.add('subscribe-job',{
            text: message
        },{repeat: { cron: message } })

        this.queue.removeRepeatable('subscribe-job', {cron : message});
    }
}
