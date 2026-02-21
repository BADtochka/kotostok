import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1771596582668 implements MigrationInterface {
    name = 'AutoMigration1771596582668'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "game_players_player" ("gameId" uuid NOT NULL, "playerId" character varying NOT NULL, CONSTRAINT "PK_3db548755c386deab0494c48cde" PRIMARY KEY ("gameId", "playerId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_93d5ad63ad904c040be60ce071" ON "game_players_player" ("gameId") `);
        await queryRunner.query(`CREATE INDEX "IDX_2a478fe145c2b9091cb964c17b" ON "game_players_player" ("playerId") `);
        await queryRunner.query(`ALTER TABLE "game_players_player" ADD CONSTRAINT "FK_93d5ad63ad904c040be60ce0712" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "game_players_player" ADD CONSTRAINT "FK_2a478fe145c2b9091cb964c17b5" FOREIGN KEY ("playerId") REFERENCES "player"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game_players_player" DROP CONSTRAINT "FK_2a478fe145c2b9091cb964c17b5"`);
        await queryRunner.query(`ALTER TABLE "game_players_player" DROP CONSTRAINT "FK_93d5ad63ad904c040be60ce0712"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2a478fe145c2b9091cb964c17b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_93d5ad63ad904c040be60ce071"`);
        await queryRunner.query(`DROP TABLE "game_players_player"`);
    }

}
