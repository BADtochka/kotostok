import { Player } from '@/player/entities/player.entity';
import type { GameBoard, GameData, GameStatus, UUID } from '@shared';
import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
    type Relation,
} from 'typeorm';

@Entity()
export class Game implements GameData {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @ManyToMany(() => Player, (player) => player.games)
  @JoinTable()
  players: Relation<Player[]>;

  @Column('varchar')
  turn: Player['id'];

  @Column({ type: 'varchar', default: 'playing' })
  status: GameStatus;

  @Column({
    type: 'json',
    default: [],
  })
  boards: GameBoard[];

  @Column('int')
  nextRoll: number;
}
