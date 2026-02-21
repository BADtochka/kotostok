import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreatePlayerDto } from './dto/CreatePlayer.dto';
import { Player } from './entities/player.entity';
import { PlayerService } from './player.service';

@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get()
  async getPlayer(@Query('id') id: string): Promise<Player | null> {
    return await this.playerService.getPlayerById(id);
  }

  @Post('/create')
  async createPlayer(@Body() { username }: CreatePlayerDto): Promise<Player> {
    return await this.playerService.createPlayer(username);
  }

  @Get('/all')
  async getAllPlayers(): Promise<Player[]> {
    return await this.playerService.getAllPlayers();
  }
}
