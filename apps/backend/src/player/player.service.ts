import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepo: Repository<Player>,
  ) {}

  async createPlayer(username: Player['username']): Promise<Player> {
    const existPlayer = await this.playerRepo.findOneBy({ username });
    if (existPlayer) return existPlayer;

    return this.playerRepo.save({
      id: crypto.randomUUID(),
      username,
      avatarUrl: 'https://vrvirtux.su/jVH3Z/zen-phsikwby1b.png/raw',
      displayName: username,
    });
  }

  async getPlayerById(id: string): Promise<Player> {
    const player = await this.playerRepo.findOneBy({ id });
    if (!player) throw new NotFoundException(`Player with id ${id} not found`);
    return player;
  }

  async getAllPlayers(): Promise<Player[]> {
    return await this.playerRepo.find();
  }

  async updatePlayer(
    id: string,
    player: Omit<Player, 'id'>,
  ): Promise<Player | null> {
    const existingPlayer = await this.playerRepo.findOneBy({ id });
    if (!existingPlayer) return null;
    return this.playerRepo.save({ ...existingPlayer, ...player });
  }

  async deletePlayer(id: string): Promise<void> {
    await this.playerRepo.softDelete({ id });
  }
}
