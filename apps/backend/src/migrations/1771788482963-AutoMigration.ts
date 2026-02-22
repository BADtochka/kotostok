import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1771788482963 implements MigrationInterface {
    name = 'AutoMigration1771788482963'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "game" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "turn" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'playing', "boards" json NOT NULL DEFAULT '[]', "winner" character varying, "nextRoll" integer, CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "player" ("id" character varying NOT NULL, "username" character varying NOT NULL, "displayName" character varying NOT NULL, "avatarUrl" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_65edadc946a7faf4b638d5e8885" PRIMARY KEY ("id"))`);
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
        await queryRunner.query(`DROP TABLE "player"`);
        await queryRunner.query(`DROP TABLE "game"`);
    }

}
