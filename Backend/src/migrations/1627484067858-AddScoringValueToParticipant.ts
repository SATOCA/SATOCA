import { MigrationInterface, QueryRunner } from "typeorm";

export class AddScoringValueToParticipant1627484067858
  implements MigrationInterface {
  name = "AddScoringValueToParticipant1627484067858";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "participant" ADD "scoring" real`);

    await queryRunner.query(`UPDATE "participant" SET "scoring" = 0.0`);

    await queryRunner.query(
      `ALTER TABLE "participant" ALTER COLUMN "scoring" SET NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "participant" DROP COLUMN "scoring"`);
  }
}
