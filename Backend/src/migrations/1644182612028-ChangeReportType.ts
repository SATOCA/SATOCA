import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeReportType1644182612028 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "report" DROP COLUMN "scoringReport"`);
    await queryRunner.query(
      `ALTER TABLE "report" DROP COLUMN "responseTimeReport"`
    );
    await queryRunner.query(
      `ALTER TABLE "report" ADD "scoringReport" character varying`
    );
    await queryRunner.query(
      `ALTER TABLE "report" ADD "responseTimeReport" character varying`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "report" DROP COLUMN "scoringReport"`);
    await queryRunner.query(
      `ALTER TABLE "report" DROP COLUMN "responseTimeReport"`
    );
    await queryRunner.query(`ALTER TABLE "report" ADD "scoringReport" JSON`);
    await queryRunner.query(
      `ALTER TABLE "report" ADD "responseTimeReport" JSON`
    );
  }
}
