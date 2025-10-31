import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(data: CreateProfileDto) {
    
    const hashed = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({ data: { ...data, password: hashed } });
  }

  async update(id: string, data: UpdateProfileDto) {
    let updateData = { ...data };
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }
    return this.prisma.user.update({ where: { id }, data: updateData });
  }

  remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}