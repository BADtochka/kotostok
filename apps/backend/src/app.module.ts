import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TYPEORM_CONFIG } from './configs/typeorm';
import { GameModule } from './game/game.module';
import { PlayerModule } from './player/player.module';
import { prepareEnv } from './utils/prepareEnv';

@Module({
  imports: [TypeOrmModule.forRoot(TYPEORM_CONFIG), PlayerModule, GameModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  async onModuleInit() {
    prepareEnv();
  }
}
