import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { Game } from '@/game/entities/game.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Player, Game])],
  providers: [PlayerService],
  controllers: [PlayerController],
})
export class PlayerModule {}
