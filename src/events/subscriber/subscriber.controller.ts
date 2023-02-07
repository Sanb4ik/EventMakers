import {Controller, Delete, Param, Post, Req, UseGuards} from '@nestjs/common';
import {AuthGuard} from "@nestjs/passport";
import {Request} from "express";
import {SubscriberService} from "./subscriber.service";
import {ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiTags} from "@nestjs/swagger";

@ApiTags("Subscriber")
@Controller('subscribe')
export class SubscriberController {
    constructor(
        private subscriberService: SubscriberService,
    ) {}

    @UseGuards(AuthGuard('jwt'))
    @Post(':id')
    @ApiBearerAuth()
    @ApiCreatedResponse({
            description: 'User subscribed successfully',
            type: String,
        }
    )
    @ApiBadRequestResponse({
        description: 'User not subscribed, because incorrect token or he is a creator',
    })
    async getInvokeMsg(@Req() req: Request, @Param('id') eventId: number,){
        const user = req.user;
        const toEmail = user['email'];
        const userId = user['sub'];
        return  this.subscriberService.subscribeToEvent(eventId, userId, toEmail);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('unfollow/:id')
    @ApiBearerAuth()
    @ApiCreatedResponse({
            description: 'User unsubscribed successfully',
            type: String,
        }
    )
    @ApiBadRequestResponse({
        description: 'User not unsubscribed, because incorrect token or he is a creator',
    })
    async unfollow(@Req() req: Request, @Param('id') eventId: number,){
        const user = req.user;
        const userId = user['sub'];
        return this.subscriberService.unfollow(eventId, userId);
    }
}
