import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1772678291030 implements MigrationInterface {
    name = 'AutoMigration1772678291030'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" ADD "winner" character varying`);
        await queryRunner.query(`ALTER TABLE "game" ALTER COLUMN "nextRoll" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "game" ALTER COLUMN "nextRoll" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" ALTER COLUMN "nextRoll" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "game" ALTER COLUMN "nextRoll" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "winner"`);
    }

}
