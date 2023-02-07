import {Controller, Get, Post, Body, Param, UseGuards, Req, Delete} from '@nestjs/common';
import { Request } from 'express';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import {AuthGuard} from "@nestjs/passport";
import {ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiTags} from "@nestjs/swagger";
import { EventEntity } from './entities/event.entity';

@ApiTags("Event")
@Controller('events')
export class EventsController {
  constructor(
      private eventsService: EventsService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  @ApiBearerAuth()
  @ApiCreatedResponse({
        description: 'User created event successfully',
        type: EventEntity
      }
  )
  @ApiBadRequestResponse({
    description: 'User not created the an event, because of incorrect access token',
  })
  create(@Body() createEventDto: CreateEventDto, @Req() req: Request) {
    console.log(req.user);
    const user = req.user
    return this.eventsService.create(createEventDto, user['sub']);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('all')
  @ApiBearerAuth()
  @ApiCreatedResponse({
        description: 'User find all his events successfully',
        type: [EventEntity]
      }
  )
  @ApiBadRequestResponse({
    description: 'User not find all his events, because of incorrect access token',
  })
  findAll(@Req() req: Request){
    const user = req.user
    return this.eventsService.findAll(user['sub']);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('find/:id')
  @ApiBearerAuth()
  @ApiCreatedResponse({
        description: 'User find his event successfully',
        type: EventEntity
      }
  )
  @ApiBadRequestResponse({
    description: 'User not find his event, because of incorrect access token',
  })
  findOne(@Param('id') eventId: number, @Req() req: Request) {
    const user = req.user
    return this.eventsService.findOne(eventId, user['sub']);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('remove/:id')
  @ApiBearerAuth()
  @ApiCreatedResponse({
        description: 'User remove his event successfully',
        type: EventEntity
      }
  )
  @ApiBadRequestResponse({
    description: 'User not remove his event, because of incorrect access token',
  })
  remove(@Param('id') eventId: number, @Req() req: Request) {
    const user = req.user
    return this.eventsService.removeOne(eventId, user['sub']);
  }
}
