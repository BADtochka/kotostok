import { Player } from '@/player/entities/player.entity';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { BoardColumns, GameBoard } from '@shared';
import type { Repository } from 'typeorm';
import { Game } from './entities/game.entity';
import { GameGateway } from './game.gateway';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private gameRepo: Repository<Game>,
    private gameGateway: GameGateway,
  ) {}

  private async createEmptyBoard(playerId: Player['id']): Promise<GameBoard> {
    const board: GameBoard = {
      ownerId: playerId,
      columns: {
        first: [],
        second: [],
        third: [],
      },
    };

    return board;
  }

  private async pickRandomPlayer(
    players: Array<Player['id']>,
  ): Promise<Player['id']> {
    const randomIndex = Math.floor(Math.random() * players.length);
    return players[randomIndex];
  }

  async getGameById(id: string): Promise<Game> {
    const game = await this.gameRepo.findOne({
      where: { id },
      relations: ['players'],
    });
    if (!game) throw new NotFoundException('Game not found');
    return game;
  }

  async createGame(
    firstPlayerId: Player['id'],
    secondPlayerId: Player['id'],
  ): Promise<Game> {
    const boards = [
      await this.createEmptyBoard(firstPlayerId),
      await this.createEmptyBoard(secondPlayerId),
    ];

    const randomPlayer = await this.pickRandomPlayer([
      firstPlayerId,
      secondPlayerId,
    ]);
    const game = this.gameRepo.create({
      boards,
      turn: randomPlayer,
      nextRoll: Math.floor(Math.random() * 6) + 1,
      players: [{ id: firstPlayerId }, { id: secondPlayerId }],
    });
    return this.gameRepo.save(game);
  }

  async makeTurn(
    gameId: Game['id'],
    playerId: Player['id'],
    column: keyof BoardColumns,
  ): Promise<Game> {
    const game = await this.getGameById(gameId);
    if (!game) throw new NotFoundException('Game not found');

    if (game.turn !== playerId)
      throw new HttpException('Not your turn', HttpStatus.FORBIDDEN);

    const playerBoard = game.boards.find((board) => board.ownerId === playerId);
    if (!playerBoard) throw new NotFoundException('Player board not found');

    if (playerBoard.columns[column].length === 3)
      throw new HttpException('Column is full', HttpStatus.BAD_REQUEST);

    const opponentId = game.players.find(
      (player) => player.id !== playerId,
    )?.id!;
    const opponentBoard = game.boards.find(
      (board) => board.ownerId === opponentId,
    );

    const opponentHasSameColumn = opponentBoard!.columns[column].some(
      (dice) => dice === game.nextRoll,
    );

    if (opponentHasSameColumn) {
      opponentBoard!.columns[column] = opponentBoard!.columns[column].filter(
        (dice) => dice !== game.nextRoll,
      );
    }
    playerBoard.columns[column].push(game.nextRoll);
    game.nextRoll = Math.floor(Math.random() * 6) + 1;
    game.turn = opponentId;

    const updatedGame = await this.gameRepo.save(game);
    this.gameGateway.server.to(game.id).emit('gameUpdated', updatedGame);
    return updatedGame;
  }

  async endGame(gameId: Game['id']): Promise<Game> {
    const game = await this.gameRepo.findOneBy({ id: gameId });
    if (!game) throw new NotFoundException('Game not found');

    game.status = 'ended';

    return this.gameRepo.save(game);
  }
}
