import type { Player } from '@/player/entities/player.entity';
import type { BoardColumns, MakeTurnRequest } from '@shared';

export class MakeTurnDto implements MakeTurnRequest {
  playerId: Player['id'];
  column: keyof BoardColumns;
}
