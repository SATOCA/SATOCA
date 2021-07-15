import {MigrationInterface, QueryRunner} from "typeorm";

export class InsertSlopeAndDifficulty1626131101379 implements MigrationInterface {
    name = 'InsertSlopeAndDifficulty1626131101379'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" ADD "startSet" boolean`);
        await queryRunner.query(`ALTER TABLE "question" ADD "slope" real`);
        await queryRunner.query(`ALTER TABLE "question" ADD "difficulty" real`);

        await queryRunner.query(`UPDATE "question" SET "startSet" = false`);
        await queryRunner.query(`UPDATE "question" SET "slope" = 0.0`);
        await queryRunner.query(`UPDATE "question" SET "difficulty" = 0.0`);

        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "startSet" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "slope" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "difficulty" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "difficulty"`);
        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "slope"`);
        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "startSet"`);
    }

}
