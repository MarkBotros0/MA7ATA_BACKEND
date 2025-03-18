import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1742330051865 implements MigrationInterface {
  name = 'InitialMigration1742330051865';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "blacklisted_refresh_tokens" ("id" SERIAL NOT NULL, "token" text NOT NULL, "expired_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "userId" integer, CONSTRAINT "PK_fe490ed264123b9db3ea4ffee5b" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."course_contents_content_type_enum" AS ENUM('article', 'video', 'quiz', 'game')`
    );
    await queryRunner.query(
      `CREATE TABLE "course_contents" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "title" character varying(100) NOT NULL, "description" text, "content_url" character varying(255), "content_type" "public"."course_contents_content_type_enum" NOT NULL DEFAULT 'video', "course_section_id" integer, CONSTRAINT "PK_e56de21b785ba03619207ce8f58" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "course_sections" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "title" character varying(100) NOT NULL, "description" text, "course_id" integer, CONSTRAINT "PK_03086ef0602f2721612a5ce610d" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "course_progress" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "percentage_completed" double precision NOT NULL DEFAULT '0', "is_completed" boolean NOT NULL DEFAULT false, "last_accessed" TIMESTAMP, "seen_content" json, "purchased_course" integer, CONSTRAINT "REL_33fd21e165b72fbd7e66da7c8d" UNIQUE ("purchased_course"), CONSTRAINT "PK_eadd1b31d44023e533eb847c4f7" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "purchased_courses" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" integer, "courseId" integer, CONSTRAINT "PK_0e77cb42fa6a061e15bb988b8ac" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "courses" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "title" character varying(100) NOT NULL, "description" text, "price" numeric(10,2) NOT NULL, "instructor_id" integer NOT NULL, CONSTRAINT "PK_3f70a487cc718ad8eda4e6d58c9" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_user_roles_enum" AS ENUM('Normal', 'Instructor', 'Admin')`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_gender_enum" AS ENUM('Male', 'Female')`
    );

    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "phone_number" character varying(15) NOT NULL, "fullname" character varying(100), "email" character varying(30), "password" text, "user_roles" "public"."users_user_roles_enum" array NOT NULL DEFAULT '{Normal}', "gender" "public"."users_gender_enum", "date_of_birth" date, CONSTRAINT "UQ_17d1817f241f10a3dbafb169fd2" UNIQUE ("phone_number"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "daily-meditations" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "title" character varying(255) NOT NULL, "article" text NOT NULL, "day" integer NOT NULL, "month" integer NOT NULL, "year" integer NOT NULL, "photo_url" text, CONSTRAINT "PK_38a16bec56ff32f9b47c2726fc8" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "otp_codes" ("phone_number" character varying(15) NOT NULL, "otp" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "expires_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_f1abf4b02558df994995214292d" PRIMARY KEY ("phone_number"))`
    );
    await queryRunner.query(
      `ALTER TABLE "blacklisted_refresh_tokens" ADD CONSTRAINT "FK_2095e3424fe134cf237a081772b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "course_contents" ADD CONSTRAINT "FK_85f658b3b0383287b92be577272" FOREIGN KEY ("course_section_id") REFERENCES "course_sections"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "course_sections" ADD CONSTRAINT "FK_348f9a7c13a6b413f10d2a1ef1a" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "course_progress" ADD CONSTRAINT "FK_33fd21e165b72fbd7e66da7c8d2" FOREIGN KEY ("purchased_course") REFERENCES "purchased_courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "purchased_courses" ADD CONSTRAINT "FK_e662f787e93fc7862f0438d1949" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "purchased_courses" ADD CONSTRAINT "FK_9bb3c4d590172590e33afe82850" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ADD CONSTRAINT "FK_4fdc83dd6b261101401ec259342" FOREIGN KEY ("instructor_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "courses" DROP CONSTRAINT "FK_4fdc83dd6b261101401ec259342"`
    );
    await queryRunner.query(
      `ALTER TABLE "purchased_courses" DROP CONSTRAINT "FK_9bb3c4d590172590e33afe82850"`
    );
    await queryRunner.query(
      `ALTER TABLE "purchased_courses" DROP CONSTRAINT "FK_e662f787e93fc7862f0438d1949"`
    );
    await queryRunner.query(
      `ALTER TABLE "course_progress" DROP CONSTRAINT "FK_33fd21e165b72fbd7e66da7c8d2"`
    );
    await queryRunner.query(
      `ALTER TABLE "course_sections" DROP CONSTRAINT "FK_348f9a7c13a6b413f10d2a1ef1a"`
    );
    await queryRunner.query(
      `ALTER TABLE "course_contents" DROP CONSTRAINT "FK_85f658b3b0383287b92be577272"`
    );
    await queryRunner.query(
      `ALTER TABLE "blacklisted_refresh_tokens" DROP CONSTRAINT "FK_2095e3424fe134cf237a081772b"`
    );
    await queryRunner.query(`DROP TABLE "otp_codes"`);
    await queryRunner.query(`DROP TABLE "daily-meditations"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_gender_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_user_roles_enum"`);
    await queryRunner.query(`DROP TABLE "courses"`);
    await queryRunner.query(`DROP TABLE "purchased_courses"`);
    await queryRunner.query(`DROP TABLE "course_progress"`);
    await queryRunner.query(`DROP TABLE "course_sections"`);
    await queryRunner.query(`DROP TABLE "course_contents"`);
    await queryRunner.query(
      `DROP TYPE "public"."course_contents_content_type_enum"`
    );
    await queryRunner.query(`DROP TABLE "blacklisted_refresh_tokens"`);
  }
}
