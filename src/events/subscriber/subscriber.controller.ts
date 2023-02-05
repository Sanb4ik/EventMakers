import {Controller, Get, Param, Req, UseGuards} from '@nestjs/common';
import {AuthGuard} from "@nestjs/passport";
import {Request} from "express";
import {SubscriberService} from "./subscriber.service";

@Controller('subscribe')
export class SubscriberController {
    constructor(
        private subscriberService: SubscriberService,
    ) {}

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    async getInvokeMsg(@Req() req: Request, @Param('id') eventId: number,){
        const user = req.user;
        const toEmail = user['email'];
        const userId = user['sub'];
        return  this.subscriberService.subscribeToEvent(eventId, userId, toEmail);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('unfollow/:id')
    async unfollow(@Req() req: Request, @Param('id') eventId: number,){
        const user = req.user;
        const userId = user['sub'];
        return this.subscriberService.unfollow(eventId, userId);
    }
}
