import {Process, Processor} from "@nestjs/bull";
import {SendgridService} from "./sendEmail.service";
import {SubscriberService} from "./subscriber.service";

@Processor('events-queue')
export class SubOnEventConsumerService {

    constructor(
        private mailService: SendgridService,
        private subscribersService: SubscriberService
    ) {
    }

    @Process('subscribe-job')
    async readOperationJob(job: any){

        const email = job.data.email;
        const title = job.data.title;
        const date = job.data.date;
        const time = job.data.time;

        await this.subscribersService.eventCompleted(job.data.eventId, job.data.userId);
        await this.mailService.send({
            subject: `Don't forget about ${title} 🧑🏼‍💻`,
            to: email,
            from:"alexandrkuznetsov.dev@gmail.com",
            html: `Hello <a>${email}</a>, you have subscribed to
                   <h1>${title}</h1>
                   <hr>
                   Event will be on ${date} at ${time}
                   on the <a>DevEvent❤️</a>`
        });
    }
}