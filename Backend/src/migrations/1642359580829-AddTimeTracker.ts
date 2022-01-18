import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTimeTracker1642359580829 implements MigrationInterface {
    name = 'AddTimeTracker1642359580829'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "time_tracker" ("id" SERIAL NOT NULL, "start" TIMESTAMP NOT NULL, "stop" TIMESTAMP NOT NULL, "surveyId" integer, "questionId" integer, "participantId" integer, CONSTRAINT "PK_b9c054817898e662e54f320d91b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "time_tracker" ADD CONSTRAINT "FK_ec73b7d8179b3df12a91ca74e66" FOREIGN KEY ("surveyId") REFERENCES "survey"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "time_tracker" ADD CONSTRAINT "FK_9f84e150fedd7a59c2ccdbacd59" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "time_tracker" ADD CONSTRAINT "FK_62ec32f5797364f8f98cc12cd8d" FOREIGN KEY ("participantId") REFERENCES "participant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "time_tracker" DROP CONSTRAINT "FK_62ec32f5797364f8f98cc12cd8d"`);
        await queryRunner.query(`ALTER TABLE "time_tracker" DROP CONSTRAINT "FK_9f84e150fedd7a59c2ccdbacd59"`);
        await queryRunner.query(`ALTER TABLE "time_tracker" DROP CONSTRAINT "FK_ec73b7d8179b3df12a91ca74e66"`);
        await queryRunner.query(`DROP TABLE "time_tracker"`);
    }

}
