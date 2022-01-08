import {MigrationInterface, QueryRunner} from "typeorm";

export class AddLegalDisclaimerToSurvey1639343371164 implements MigrationInterface {
    name = 'AddLegalDisclaimerToSurvey1639343371164'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey" ADD "legalDisclaimer" character varying`);
        await queryRunner.query(`UPDATE "survey" SET "legalDisclaimer"='' `);
        await queryRunner.query(
            `ALTER TABLE "survey" ALTER COLUMN "legalDisclaimer" SET NOT NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey" DROP COLUMN "legalDisclaimer"`);
    }

}
