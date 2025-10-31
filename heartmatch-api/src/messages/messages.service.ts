import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  findByMatch(matchId: string) {
    return this.prisma.message.findMany({
      where: { matchId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(data: { matchId: string; senderId: string; content: string }) {
    return this.prisma.message.create({ data });
  }
}
