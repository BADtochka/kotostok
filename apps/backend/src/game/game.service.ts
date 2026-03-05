import { Player } from '@/player/entities/player.entity';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { BoardColumns, GameBoard } from '@shared';
import { getObjectKeys } from 'badlib';
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
      score: 0,
    };

    return board;
  }

  private async pickRandomPlayer(
    players: Array<Player['id']>,
  ): Promise<Player['id']> {
    const randomIndex = Math.floor(Math.random() * players.length);
    return players[randomIndex];
  }

  private validateTurn(game: Game, playerId: Player['id']): void {
    if (!game) throw new NotFoundException('Game not found');
    if (game.turn !== playerId)
      throw new HttpException('Not your turn', HttpStatus.FORBIDDEN);
  }

  private getBoards(game: Game, playerId: Player['id']) {
    const playerBoard = game.boards.find((b) => b.ownerId === playerId);
    if (!playerBoard) throw new NotFoundException('Player board not found');

    const opponentId = game.players.find((p) => p.id !== playerId)!.id;
    const opponentBoard = game.boards.find((b) => b.ownerId === opponentId)!;

    return { playerBoard, opponentBoard };
  }

  private getBoardInfo(board: GameBoard) {
    const columns = getObjectKeys(board.columns);
    const columnDice = columns.map((key) =>
      board.columns[key].map((dice) => dice),
    );

    const diceCounts = columns.reduce(
      (acc, key) => acc + board.columns[key].length,
      0,
    );
    return { columnDice, diceCounts };
  }

  private calculateScore(board: GameBoard) {
    const { columnDice } = this.getBoardInfo(board);
    const columnsSum: number[] = [];

    for (const column of columnDice) {
      const duplicatesCount = column.reduce<Record<string, number>>(
        (acc, value) => ({ ...acc, [value]: (acc[value] || 0) + 1 }),
        {},
      );

      let columnSum = 0;
      for (const diceKey of getObjectKeys(duplicatesCount)) {
        const count = duplicatesCount[diceKey];
        const value = Number(diceKey);
        columnSum += value * count * count;
      }

      columnsSum.push(columnSum);
    }

    board.score = columnsSum.reduce((acc, value) => acc + value, 0);
  }

  private async applyMove(
    game: Game,
    playerBoard: GameBoard,
    opponentBoard: GameBoard,
    column: keyof BoardColumns,
  ) {
    if (playerBoard.columns[column].length === 3)
      throw new HttpException('Column is full', HttpStatus.FORBIDDEN);

    if (!game.nextRoll || game.status === 'ended')
      throw new HttpException('Game is ended', HttpStatus.FORBIDDEN);

    opponentBoard.columns[column] = opponentBoard.columns[column].filter(
      (dice) => dice !== game.nextRoll,
    );

    playerBoard.columns[column].push(game.nextRoll!);
    console.log('applyMove', playerBoard.columns);

    this.calculateScore(playerBoard);
    this.calculateScore(opponentBoard);
  }

  private isBoardFull(playerBoard: GameBoard): boolean {
    return this.getBoardInfo(playerBoard).diceCounts === 9;
  }

  private async finalizeGame(
    game: Game,
    playerBoard: GameBoard,
  ): Promise<Game> {
    if (this.isBoardFull(playerBoard)) {
      const endedGame = await this.endGame(game);
      this.gameGateway.server.to(game.id).emit('gameUpdated', endedGame);
      return endedGame;
    } else {
      const opponentId = game.boards.find(
        (b) => b.ownerId !== game.turn,
      )!.ownerId;
      game.nextRoll = Math.floor(Math.random() * 6) + 1;
      game.turn = opponentId;
    }

    console.log(
      'finalGame',
      game.boards.map((col) => col.columns),
    );

    const updatedGame = await this.gameRepo.save(game);
    this.gameGateway.server.to(game.id).emit('gameUpdated', updatedGame);
    return updatedGame;
  }

  async getGameById(id: string): Promise<Game> {
    console.log('getGameById', id)
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
    const playingGames = await this.gameRepo.find({
      where: {
        status: 'playing',
      },
      relations: ['players'],
    });
    const existedGame = playingGames.find((game) =>
      game.players.some(
        (player) => player.id === firstPlayerId || player.id === secondPlayerId,
      ),
    );

    if (existedGame) return existedGame;

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

    this.validateTurn(game, playerId);

    const { playerBoard, opponentBoard } = this.getBoards(game, playerId);

    await this.applyMove(game, playerBoard, opponentBoard, column);

    console.log(
      'afterApply',
      game.boards.map((col) => col.columns),
    );

    const finalizedGame = await this.finalizeGame(game, playerBoard);
    return finalizedGame;
  }

  async endGame(game: Game): Promise<Game> {
    const sortedByScoreBoards = game.boards
      .slice()
      .sort((a, b) => b.score - a.score);

    game.status = 'ended';
    game.winner = sortedByScoreBoards[0].ownerId;
    game.nextRoll = null;
    this.gameGateway.server.to(game.id).emit('gameEnded', game);

    return this.gameRepo.save(game);
  }
}
