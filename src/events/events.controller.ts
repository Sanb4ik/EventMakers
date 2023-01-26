import {Controller, Get, Post, Body, Param, UseGuards, Req, Query} from '@nestjs/common';
import { Request } from 'express';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import {AuthGuard} from "@nestjs/passport";
import {SubOnEventProducerService} from "./subOnEvent.producer.service";

@Controller('events')
export class EventsController {
  constructor(
      private eventsService: EventsService,
      private subOnEventProducerService:SubOnEventProducerService
  ) {}

  @Get('test')
  getInvokeMsg(@Query('msg') msg:string){
    this.subOnEventProducerService.sendMessage(msg);
    return msg;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  create(@Body() createEventDto: CreateEventDto, @Req() req: Request) {
    console.log(req.user);
    const user = req.user
    return this.eventsService.create(createEventDto, user['sub']);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('all')
  findAll(@Req() req: Request){
    const user = req.user
    return this.eventsService.findAll(user['sub']);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('find/:id')
  findOne(@Param('id') id: number, @Req() req: Request) {
    const user = req.user
    return this.eventsService.findOne(id, user['sub']);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('remove/:id')
  remove(@Param('id') id: number, @Req() req: Request) {
    const user = req.user
    return this.eventsService.remove(id, user['sub']);
  }
}
