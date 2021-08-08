import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDatabase1626131101370 implements MigrationInterface {
  name = "CreateDatabase1626131101370";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "answer" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "correct" boolean NOT NULL, "questionId" integer, "finishedQuestionId" integer, CONSTRAINT "PK_9232db17b63fb1e94f97e5c224f" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "question" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "multiResponse" boolean NOT NULL, "surveyId" integer, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "finished_question" ("id" SERIAL NOT NULL, "questionId" integer, "participantId" integer, CONSTRAINT "PK_d1b95600ebe54803c46cbcea890" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "participant" ("id" SERIAL NOT NULL, "uuid" character varying NOT NULL, "finished" boolean NOT NULL, "surveyId" integer, "currentQuestionId" integer, CONSTRAINT "UQ_17ee2407d4601d57083492b4a7b" UNIQUE ("uuid"), CONSTRAINT "PK_64da4237f502041781ca15d4c41" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "survey" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, CONSTRAINT "PK_f0da32b9181e9c02ecf0be11ed3" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "trustee" ("id" SERIAL NOT NULL, "login" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_89836f52899e870da8b74978bbc" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "answer" ADD CONSTRAINT "FK_a4013f10cd6924793fbd5f0d637" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "answer" ADD CONSTRAINT "FK_db434cdae8b4865ca9de0200932" FOREIGN KEY ("finishedQuestionId") REFERENCES "finished_question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "question" ADD CONSTRAINT "FK_a1188e0f702ab268e0982049e5c" FOREIGN KEY ("surveyId") REFERENCES "survey"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "finished_question" ADD CONSTRAINT "FK_8a638983506e0bce8eaef9d2567" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "finished_question" ADD CONSTRAINT "FK_e79a733f472a3f7222e5e98efc3" FOREIGN KEY ("participantId") REFERENCES "participant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "participant" ADD CONSTRAINT "FK_171585a79e271d4b227942f68e7" FOREIGN KEY ("surveyId") REFERENCES "survey"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "participant" ADD CONSTRAINT "FK_192ae92cca1c2dc3f75bd40f6a2" FOREIGN KEY ("currentQuestionId") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "participant" DROP CONSTRAINT "FK_192ae92cca1c2dc3f75bd40f6a2"`
    );
    await queryRunner.query(
      `ALTER TABLE "participant" DROP CONSTRAINT "FK_171585a79e271d4b227942f68e7"`
    );
    await queryRunner.query(
      `ALTER TABLE "finished_question" DROP CONSTRAINT "FK_e79a733f472a3f7222e5e98efc3"`
    );
    await queryRunner.query(
      `ALTER TABLE "finished_question" DROP CONSTRAINT "FK_8a638983506e0bce8eaef9d2567"`
    );
    await queryRunner.query(
      `ALTER TABLE "question" DROP CONSTRAINT "FK_a1188e0f702ab268e0982049e5c"`
    );
    await queryRunner.query(
      `ALTER TABLE "answer" DROP CONSTRAINT "FK_db434cdae8b4865ca9de0200932"`
    );
    await queryRunner.query(
      `ALTER TABLE "answer" DROP CONSTRAINT "FK_a4013f10cd6924793fbd5f0d637"`
    );
    await queryRunner.query(`DROP TABLE "trustee"`);
    await queryRunner.query(`DROP TABLE "survey"`);
    await queryRunner.query(`DROP TABLE "participant"`);
    await queryRunner.query(`DROP TABLE "finished_question"`);
    await queryRunner.query(`DROP TABLE "question"`);
    await queryRunner.query(`DROP TABLE "answer"`);
  }
}
