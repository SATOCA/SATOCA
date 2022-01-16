import {MigrationInterface, QueryRunner} from "typeorm";

export class AddReportTable1642354261094 implements MigrationInterface {
    name = 'AddReportTable1642354261094'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "report" ("id" SERIAL NOT NULL, "scoringReport" json NOT NULL, "responseTimeReport" json NOT NULL, "surveyIdId" integer, CONSTRAINT "REL_1ed75c66ba01f383cfb6b0dfdd" UNIQUE ("surveyIdId"), CONSTRAINT "PK_99e4d0bea58cba73c57f935a546" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "report" ADD CONSTRAINT "FK_1ed75c66ba01f383cfb6b0dfddf" FOREIGN KEY ("surveyIdId") REFERENCES "survey"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "report" DROP CONSTRAINT "FK_1ed75c66ba01f383cfb6b0dfddf"`);
        await queryRunner.query(`DROP TABLE "report"`);
    }

}
