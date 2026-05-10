import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSyllabusTables1777795320000 implements MigrationInterface {
    name = 'CreateSyllabusTables1777795320000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create syllabus table
        await queryRunner.query(`
            CREATE TABLE s_core."syllabus" (
                "syllabus_id" BIGSERIAL PRIMARY KEY,
                "class_id" BIGINT NOT NULL,
                "subject_id" BIGINT NOT NULL,
                "term_id" BIGINT,
                "academic_year" VARCHAR(20),
                "status" VARCHAR(50),
                "auth_add" VARCHAR(200),
                "auth_lst_edt" VARCHAR(200),
                "auth_del" VARCHAR(200),
                "add_on_dt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                "edit_on_dt" TIMESTAMPTZ,
                "del_on_dt" TIMESTAMPTZ,
                "del_status" BOOLEAN DEFAULT false
            )
        `);

        // Index for commonly queried fields in syllabus
        await queryRunner.query(`CREATE INDEX "idx_syllabus_class_id" ON s_core."syllabus"("class_id")`);
        await queryRunner.query(`CREATE INDEX "idx_syllabus_subject_id" ON s_core."syllabus"("subject_id")`);

        // Create syllabus_chapter table
        await queryRunner.query(`
            CREATE TABLE s_core."syllabus_chapter" (
                "syllabus_chapter_id" BIGSERIAL PRIMARY KEY,
                "syllabus_id" BIGINT NOT NULL,
                "chapter_name" VARCHAR(255) NOT NULL,
                "chapter_order" INT,
                "is_completed" BOOLEAN DEFAULT false,
                "auth_add" VARCHAR(200),
                "auth_lst_edt" VARCHAR(200),
                "auth_del" VARCHAR(200),
                "add_on_dt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                "edit_on_dt" TIMESTAMPTZ,
                "del_on_dt" TIMESTAMPTZ,
                "del_status" BOOLEAN DEFAULT false,
                CONSTRAINT "fk_syllabus_chapter_syllabus_id" FOREIGN KEY ("syllabus_id") REFERENCES s_core."syllabus"("syllabus_id") ON DELETE CASCADE
            )
        `);

        // Index for syllabus_chapter foreign key
        await queryRunner.query(`CREATE INDEX "idx_syllabus_chapter_syllabus_id" ON s_core."syllabus_chapter"("syllabus_id")`);

        // Create syllabus_topic table
        await queryRunner.query(`
            CREATE TABLE s_core."syllabus_topic" (
                "topic_id" BIGSERIAL PRIMARY KEY,
                "syllabus_chapter_id" BIGINT NOT NULL,
                "topic_name" VARCHAR(255) NOT NULL,
                "topic_content" TEXT,
                "is_completed" BOOLEAN DEFAULT false,
                "completed_date" TIMESTAMPTZ,
                "auth_add" VARCHAR(200),
                "auth_lst_edt" VARCHAR(200),
                "auth_del" VARCHAR(200),
                "add_on_dt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                "edit_on_dt" TIMESTAMPTZ,
                "del_on_dt" TIMESTAMPTZ,
                "del_status" BOOLEAN DEFAULT false,
                CONSTRAINT "fk_syllabus_topic_syllabus_chapter_id" FOREIGN KEY ("syllabus_chapter_id") REFERENCES s_core."syllabus_chapter"("syllabus_chapter_id") ON DELETE CASCADE
            )
        `);

        // Index for syllabus_topic foreign key
        await queryRunner.query(`CREATE INDEX "idx_syllabus_topic_syllabus_chapter_id" ON s_core."syllabus_topic"("syllabus_chapter_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop tables in reverse order of creation
        await queryRunner.query(`DROP TABLE s_core."syllabus_topic"`);
        await queryRunner.query(`DROP TABLE s_core."syllabus_chapter"`);
        await queryRunner.query(`DROP TABLE s_core."syllabus"`);
    }
}
