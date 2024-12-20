import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1734638765443 implements MigrationInterface {
  name = 'InitialMigration1734638765443';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`blacklisted_refresh_tokens\` (
        \`id\` int NOT NULL AUTO_INCREMENT, 
        \`userId\` int NULL, 
        \`expired_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
        \`token\` text NOT NULL, 
        PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`course_contents\` (
        \`id\` int NOT NULL AUTO_INCREMENT, 
        \`title\` varchar(100) NOT NULL, 
        \`description\` text NULL, 
        \`content_url\` varchar(255) NULL, 
        \`content_type\` enum ('article', 'video', 'quiz', 'game') NOT NULL DEFAULT 'video', 
        \`course_section_id\` int NULL, 
        \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
        \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), 
        \`deletedAt\` datetime(6) NULL, 
        PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`course_sections\` (
        \`id\` int NOT NULL AUTO_INCREMENT, 
        \`title\` varchar(100) NOT NULL, 
        \`description\` text NULL, 
        \`course_id\` int NULL, 
        \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
        \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), 
        \`deletedAt\` datetime(6) NULL, 
        PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`course_progress\` (
        \`id\` int NOT NULL AUTO_INCREMENT, 
        \`seen_content\` json NULL, \`purchased_course\` int NULL, 
        \`percentage_completed\` float NOT NULL DEFAULT '0', 
        \`is_completed\` tinyint NOT NULL DEFAULT 0, \`last_accessed\` timestamp NULL, 
        \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
        \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), 
        \`deletedAt\` datetime(6) NULL, 
        UNIQUE INDEX \`REL_33fd21e165b72fbd7e66da7c8d\` (\`purchased_course\`), 
        PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`purchased_courses\` (
        \`id\` int NOT NULL AUTO_INCREMENT, 
        \`userId\` int NULL, 
        \`courseId\` int NULL, 
        \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
        \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), 
        \`deletedAt\` datetime(6) NULL, 
        PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`courses\` (
        \`id\` int NOT NULL AUTO_INCREMENT, 
        \`title\` varchar(100) NOT NULL, 
        \`description\` text NULL, 
        \`price\` decimal(10,2) NOT NULL, 
        \`instructor_id\` int NOT NULL, 
        \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
        \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), 
        \`deletedAt\` datetime(6) NULL, 
        PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`users\` (
        \`id\` int NOT NULL AUTO_INCREMENT, 
        \`phone_number\` varchar(15) NOT NULL, 
        \`fullname\` varchar(100) NULL, 
        \`email\` varchar(30) NULL, 
        \`password\` text NULL, \`user_roles\` set ('Normal', 'Instructor', 'Admin') NOT NULL DEFAULT 'Normal', 
        \`gender\` set ('Male', 'Female') NULL, \`date_of_birth\` date NULL, 
        \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
        \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), 
        \`deletedAt\` datetime(6) NULL, 
        UNIQUE INDEX \`IDX_17d1817f241f10a3dbafb169fd\` (\`phone_number\`), 
        PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`otp_codes\` (
        \`phone_number\` varchar(15) NOT NULL, 
        \`otp\` text NOT NULL, 
        \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
        \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), 
        \`expires_at\` timestamp NOT NULL, 
        PRIMARY KEY (\`phone_number\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `ALTER TABLE \`blacklisted_refresh_tokens\` 
        ADD CONSTRAINT \`FK_2095e3424fe134cf237a081772b\` 
        FOREIGN KEY (\`userId\`) 
        REFERENCES \`users\`(\`id\`) 
        ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`course_contents\` 
        ADD CONSTRAINT \`FK_85f658b3b0383287b92be577272\` 
        FOREIGN KEY (\`course_section_id\`) 
        REFERENCES \`course_sections\`(\`id\`) 
        ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`course_sections\` 
        ADD CONSTRAINT \`FK_348f9a7c13a6b413f10d2a1ef1a\` 
        FOREIGN KEY (\`course_id\`) 
        REFERENCES \`courses\`(\`id\`) 
        ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`course_progress\` 
        ADD CONSTRAINT \`FK_33fd21e165b72fbd7e66da7c8d2\` 
        FOREIGN KEY (\`purchased_course\`) 
        REFERENCES \`purchased_courses\`(\`id\`) 
        ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`purchased_courses\` 
        ADD CONSTRAINT \`FK_e662f787e93fc7862f0438d1949\` 
        FOREIGN KEY (\`userId\`) 
        REFERENCES \`users\`(\`id\`) 
        ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`purchased_courses\` 
        ADD CONSTRAINT \`FK_9bb3c4d590172590e33afe82850\` 
        FOREIGN KEY (\`courseId\`) 
        REFERENCES \`courses\`(\`id\`) 
        ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`courses\` 
        ADD CONSTRAINT \`FK_4fdc83dd6b261101401ec259342\` 
        FOREIGN KEY (\`instructor_id\`) 
        REFERENCES \`users\`(\`id\`) 
        ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`courses\` DROP FOREIGN KEY \`FK_4fdc83dd6b261101401ec259342\``
    );
    await queryRunner.query(
      `ALTER TABLE \`purchased_courses\` DROP FOREIGN KEY \`FK_9bb3c4d590172590e33afe82850\``
    );
    await queryRunner.query(
      `ALTER TABLE \`purchased_courses\` DROP FOREIGN KEY \`FK_e662f787e93fc7862f0438d1949\``
    );
    await queryRunner.query(
      `ALTER TABLE \`course_progress\` DROP FOREIGN KEY \`FK_33fd21e165b72fbd7e66da7c8d2\``
    );
    await queryRunner.query(
      `ALTER TABLE \`course_sections\` DROP FOREIGN KEY \`FK_348f9a7c13a6b413f10d2a1ef1a\``
    );
    await queryRunner.query(
      `ALTER TABLE \`course_contents\` DROP FOREIGN KEY \`FK_85f658b3b0383287b92be577272\``
    );
    await queryRunner.query(
      `ALTER TABLE \`blacklisted_refresh_tokens\` DROP FOREIGN KEY \`FK_2095e3424fe134cf237a081772b\``
    );
    await queryRunner.query(`DROP TABLE \`otp_codes\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_17d1817f241f10a3dbafb169fd\` ON \`users\``
    );
    await queryRunner.query(`DROP TABLE \`users\``);
    await queryRunner.query(`DROP TABLE \`courses\``);
    await queryRunner.query(`DROP TABLE \`purchased_courses\``);
    await queryRunner.query(
      `DROP INDEX \`REL_33fd21e165b72fbd7e66da7c8d\` ON \`course_progress\``
    );
    await queryRunner.query(`DROP TABLE \`course_progress\``);
    await queryRunner.query(`DROP TABLE \`course_sections\``);
    await queryRunner.query(`DROP TABLE \`course_contents\``);
    await queryRunner.query(`DROP TABLE \`blacklisted_refresh_tokens\``);
  }
}
