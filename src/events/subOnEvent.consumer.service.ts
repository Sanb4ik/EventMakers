import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";

@Processor('events-queue')
export class SubOnEventConsumerService {

    @Process('subscribe-job')
    readOperationJob(job:Job<unknown>){
        console.log(job.data);
    }
}