import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1771596497608 implements MigrationInterface {
    name = 'AutoMigration1771596497608'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "game" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "turn" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'playing', "boards" json NOT NULL DEFAULT '[]', "nextRoll" integer NOT NULL, CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "player" ("id" character varying NOT NULL, "username" character varying NOT NULL, "displayName" character varying NOT NULL, "avatarUrl" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_65edadc946a7faf4b638d5e8885" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "player"`);
        await queryRunner.query(`DROP TABLE "game"`);
    }

}
