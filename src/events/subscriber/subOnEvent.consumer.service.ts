import {Process, Processor} from "@nestjs/bull";
import {Job} from "bull";
import {SendgridService} from "./sendEmail.service";

@Processor('events-queue')
export class SubOnEventConsumerService {

    constructor(private mailService: SendgridService) {
    }

    @Process('subscribe-job')
    async readOperationJob(job:Job<unknown>){

        // const email = JSON.stringify(job.data); edit email
        //
        // await this.mailService.send({
        //     subject: 'EventEntity Subscribed now!!!!!!!!',
        //     to: email,
        //     from:"alexandrkuznetsov.dev@gmail.com",
        //     text: `${JSON.stringify(job.data)}`,
        // });
        console.log(job.data);
    }
}