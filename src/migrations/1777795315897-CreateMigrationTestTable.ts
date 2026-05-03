import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMigrationTestTable1777795315897 implements MigrationInterface {
    name = 'CreateMigrationTestTable1777795315897'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "migration_test" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_891689a1eff0e36b81da8f5b2e8" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "migration_test"`);
    }

}
