import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProfilesModule } from './profiles/profiles.module';
import { LikesModule } from './likes/likes.module';
import { MatchesModule } from './matches/matches.module';

@Module({
  imports: [PrismaModule, ProfilesModule, LikesModule, MatchesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
