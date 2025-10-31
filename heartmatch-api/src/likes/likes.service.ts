import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';

@Injectable()
export class LikesService {
  constructor(private prisma: PrismaService) {}

  async create(createLikeDto: CreateLikeDto) {
    const { fromId, toId } = createLikeDto;
    const like = await this.prisma.like.create({ data: createLikeDto });
    // Check for a mutual like
    const mutual = await this.prisma.like.findFirst({ where: { fromId: toId, toId: fromId } });
    let match: any = null;
    if (mutual) {
      // Always put lower user id in userAId (for unique index)
      const [userAId, userBId] = fromId < toId ? [fromId, toId] : [toId, fromId];
      match = await this.prisma.match.upsert({
        where: { userAId_userBId: { userAId, userBId } },
        update: {},
        create: { userAId, userBId },
      });
    }
    return { like, match };
  }

  findAll() {
    return this.prisma.like.findMany();
  }

  findByUser(userId: string) {
    return this.prisma.like.findMany({ where: { fromId: userId } });
  }

  findOne(id: string) {
    return this.prisma.like.findUnique({ where: { id } });
  }

  update(id: string, updateLikeDto: UpdateLikeDto) {
    return this.prisma.like.update({ where: { id }, data: updateLikeDto });
  }

  remove(id: string) {
    return this.prisma.like.delete({ where: { id } });
  }
}
