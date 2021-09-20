import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMinimalInformationGainToSurvey1632154049049 implements MigrationInterface {
    name = 'AddMinimalInformationGainToSurvey1632154049049'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey" ADD "minimalInformationGain" real`);

        await queryRunner.query(`UPDATE "survey" SET "minimalInformationGain" = 0.0`);

        await queryRunner.query(`ALTER TABLE "survey" ALTER COLUMN "minimalInformationGain" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey" DROP COLUMN "minimalInformationGain"`);
    }

}
