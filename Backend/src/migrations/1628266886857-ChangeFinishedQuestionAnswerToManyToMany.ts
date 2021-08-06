import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeFinishedQuestionAnswerToManyToMany1628266886857 implements MigrationInterface {
    name = 'ChangeFinishedQuestionAnswerToManyToMany1628266886857'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_db434cdae8b4865ca9de0200932"`);
        await queryRunner.query(`CREATE TABLE "finished_question_given_answers_answer" ("finishedQuestionId" integer NOT NULL, "answerId" integer NOT NULL, CONSTRAINT "PK_ac6c9d34b18edb337d5de34a503" PRIMARY KEY ("finishedQuestionId", "answerId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_479bf32f1821ce66508a5d838c" ON "finished_question_given_answers_answer" ("finishedQuestionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_64429a0c9dabad59dd4ef1c078" ON "finished_question_given_answers_answer" ("answerId") `);
        await queryRunner.query(`ALTER TABLE "answer" DROP COLUMN "finishedQuestionId"`);
        await queryRunner.query(`ALTER TABLE "finished_question_given_answers_answer" ADD CONSTRAINT "FK_479bf32f1821ce66508a5d838cd" FOREIGN KEY ("finishedQuestionId") REFERENCES "finished_question"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "finished_question_given_answers_answer" ADD CONSTRAINT "FK_64429a0c9dabad59dd4ef1c0782" FOREIGN KEY ("answerId") REFERENCES "answer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "finished_question_given_answers_answer" DROP CONSTRAINT "FK_64429a0c9dabad59dd4ef1c0782"`);
        await queryRunner.query(`ALTER TABLE "finished_question_given_answers_answer" DROP CONSTRAINT "FK_479bf32f1821ce66508a5d838cd"`);
        await queryRunner.query(`ALTER TABLE "answer" ADD "finishedQuestionId" integer`);
        await queryRunner.query(`DROP INDEX "IDX_64429a0c9dabad59dd4ef1c078"`);
        await queryRunner.query(`DROP INDEX "IDX_479bf32f1821ce66508a5d838c"`);
        await queryRunner.query(`DROP TABLE "finished_question_given_answers_answer"`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_db434cdae8b4865ca9de0200932" FOREIGN KEY ("finishedQuestionId") REFERENCES "finished_question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
