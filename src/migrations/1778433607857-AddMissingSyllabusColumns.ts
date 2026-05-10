import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMissingSyllabusColumns1778433607857 implements MigrationInterface {
    name = 'AddMissingSyllabusColumns1778433607857'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE s_core."syllabus" ADD COLUMN "term_name" VARCHAR(50)`);
        await queryRunner.query(`ALTER TABLE s_core."syllabus" ADD COLUMN "total_topics" INT DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE s_core."syllabus" ADD COLUMN "completed_topics" INT DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE s_core."syllabus" ADD COLUMN "document" VARCHAR(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE s_core."syllabus" DROP COLUMN "document"`);
        await queryRunner.query(`ALTER TABLE s_core."syllabus" DROP COLUMN "completed_topics"`);
        await queryRunner.query(`ALTER TABLE s_core."syllabus" DROP COLUMN "total_topics"`);
        await queryRunner.query(`ALTER TABLE s_core."syllabus" DROP COLUMN "term_name"`);
    }
}
