import {MigrationInterface, QueryRunner} from "typeorm";

export class AddClosedStatus1640181745998 implements MigrationInterface {
    name = 'AddClosedStatus1640181745998'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey" ADD "isClosed" boolean`);
        await queryRunner.query(`UPDATE "survey" SET "isClosed" = false`);
        await queryRunner.query(
            `ALTER TABLE "survey" ALTER COLUMN "isClosed" SET NOT NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey" DROP COLUMN "isClosed"`);
    }

}
