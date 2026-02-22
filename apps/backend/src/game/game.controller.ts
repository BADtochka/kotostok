import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { CreateGameDto } from './dto/CreateGame.dto';
import { MakeTurnDto } from './dto/MakeTurn.dto';
import { Game } from './entities/game.entity';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Get('all')
  async getAllGames(): Promise<Game[]> {
    // Implement logic to fetch all games
    return [];
  }

  @Get('/:id')
  async getgameById(@Param('id') id: string): Promise<Game> {
    return await this.gameService.getGameById(id);
  }

  @Post('/create')
  async createGame(
    @Body() { firstPlayerId, secondPlayerId }: CreateGameDto,
  ): Promise<Game> {
    return await this.gameService.createGame(firstPlayerId, secondPlayerId);
  }

  @Post('/:gameId/turn')
  async makeTurn(
    @Param('gameId') gameId: string,
    @Body() { playerId, column }: MakeTurnDto,
  ): Promise<Game> {
    return await this.gameService.makeTurn(gameId, playerId, column);
  }

  // @Get('/:id/join')
  // async joingame(@Param('id') id: string): Promise<Game> {
  //   // Implement logic to join game
  //   return {};
  // }

  // @Get('/:id/leave')
  // async leavegame(@Param('id') id: string): Promise<any> {
  //   // Implement logic to leave game
  //   return {};
  // }

  // @Get('/:id/start')
  // async startGame(@Param('id') id: string): Promise<any> {
  //   // Implement logic to start game
  //   return {};
  // }

  @Post('/:gameId/end')
  async endGame(@Param('gameId') gameId: string): Promise<Game> {
    const game = await this.gameService.getGameById(gameId);
    if (!game) throw new NotFoundException('Room not found');
    return await this.gameService.endGame(game);
  }
}
