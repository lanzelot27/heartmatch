import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  findByMatch(@Query('matchId') matchId: string) {
    if (!matchId) return [];
    return this.messagesService.findByMatch(matchId);
  }

  @Post()
  create(@Body() body: { matchId: string; senderId: string; content: string }) {
    return this.messagesService.create(body);
  }
}
