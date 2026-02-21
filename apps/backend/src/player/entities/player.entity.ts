import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryColumn,
  type Relation,
  UpdateDateColumn,
} from 'typeorm';

import { Game } from '@/game/entities/game.entity';
import type { PlayerData } from '@shared';

@Entity()
export class Player implements PlayerData {
  @PrimaryColumn()
  id: string;

  @Column()
  username: string;

  @Column()
  displayName: string;

  @Column()
  avatarUrl: string;

  @ManyToMany(() => Game, (game) => game.players)
  games: Relation<Game[]>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
