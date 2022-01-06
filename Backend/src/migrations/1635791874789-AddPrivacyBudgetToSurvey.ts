import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPrivacyBudgetToSurvey1635791874789
  implements MigrationInterface {
  name = "AddPrivacyBudgetToSurvey1635791874789";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "survey" ADD "privacyBudget" real`);
    await queryRunner.query(`UPDATE "survey" SET "privacyBudget" =1.0`);
    await queryRunner.query(
      `ALTER TABLE "survey" ALTER COLUMN "privacyBudget" SET NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "survey" DROP COLUMN "privacyBudget"`);
  }
}
