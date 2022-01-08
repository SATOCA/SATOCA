import {MigrationInterface, QueryRunner} from "typeorm";

export class AddLegalDisclaimerToParticipant1641288428360 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "participant" ADD "legalDisclaimerAccepted" boolean`);

        await queryRunner.query(`UPDATE "participant" SET "legalDisclaimerAccepted"= false `);

        await queryRunner.query(`ALTER TABLE "participant" ALTER COLUMN "legalDisclaimerAccepted" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "participant" DROP COLUMN "legalDisclaimerAccepted"`);
    }
}
