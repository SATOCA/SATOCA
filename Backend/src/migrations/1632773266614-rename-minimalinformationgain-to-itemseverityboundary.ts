import {MigrationInterface, QueryRunner} from "typeorm";

export class renameMinimalinformationgainToItemseverityboundary1632773266614 implements MigrationInterface {
    name = 'renameMinimalinformationgainToItemseverityboundary1632773266614'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey" RENAME COLUMN "minimalInformationGain" TO "itemSeverityBoundary"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey" RENAME COLUMN "itemSeverityBoundary" TO "minimalInformationGain"`);
    }

}
