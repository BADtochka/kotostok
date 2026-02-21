import { Player } from '@/player/entities/player.entity';
import type { CreateGameRequest } from '@shared';

export class CreateGameDto implements CreateGameRequest {
  firstPlayerId: Player['id'];
  secondPlayerId: Player['id'];
}
