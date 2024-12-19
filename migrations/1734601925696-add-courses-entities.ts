import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCoursesEntities1734601925696 implements MigrationInterface {
  name = 'AddCoursesEntities1734601925696';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`course_content\` (
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
      `CREATE TABLE \`course_section\` (
        \`id\` int NOT NULL AUTO_INCREMENT, 
        \`title\` varchar(100) NOT NULL, 
        \`description\` text NULL, \`course_id\` int NULL, 
        \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
        \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), 
        \`deletedAt\` datetime(6) NULL, 
        PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`course_progress\` (
        \`id\` int NOT NULL AUTO_INCREMENT, 
        \`percentageCompleted\` float NOT NULL DEFAULT '0', 
        \`isCompleted\` tinyint NOT NULL DEFAULT 0, 
        \`lastAccessed\` timestamp NULL, 
        \`userId\` int NULL, 
        \`courseId\` int NULL, 
        \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
        \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), 
        \`deletedAt\` datetime(6) NULL, 
        PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`course\` (
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
      `ALTER TABLE \`course_content\` 
        ADD CONSTRAINT \`FK_48d76e9bd5455ab7850ed75e07b\` 
        FOREIGN KEY (\`course_section_id\`) 
        REFERENCES \`course_section\`(\`id\`) 
        ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`course_section\` 
        ADD CONSTRAINT \`FK_96e2b12714357c99e42ca45be9c\` 
        FOREIGN KEY (\`course_id\`) 
        REFERENCES \`course\`(\`id\`) 
        ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`course-progress\` 
        ADD CONSTRAINT \`FK_00906e5e0c720c964f862c593cc\` 
        FOREIGN KEY (\`userId\`) 
        REFERENCES \`users\`(\`id\`) 
        ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`course-progress\` 
        ADD CONSTRAINT \`FK_de90fa95cb34ddf3238e04e5b8c\` 
        FOREIGN KEY (\`courseId\`) 
        REFERENCES \`course\`(\`id\`) 
        ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`course\` 
        ADD CONSTRAINT \`FK_f4acb7f54962af04a558b1a5ed9\` 
        FOREIGN KEY (\`instructor_id\`) 
        REFERENCES \`users\`(\`id\`) 
        ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`course\` 
        DROP FOREIGN KEY \`FK_f4acb7f54962af04a558b1a5ed9\``
    );
    await queryRunner.query(
      `ALTER TABLE \`course-progress\`
        DROP FOREIGN KEY \`FK_de90fa95cb34ddf3238e04e5b8c\``
    );
    await queryRunner.query(
      `ALTER TABLE \`course-progress\` 
        DROP FOREIGN KEY \`FK_00906e5e0c720c964f862c593cc\``
    );
    await queryRunner.query(
      `ALTER TABLE \`course_section\` 
        DROP FOREIGN KEY \`FK_96e2b12714357c99e42ca45be9c\``
    );
    await queryRunner.query(
      `ALTER TABLE \`course_content\` 
        DROP FOREIGN KEY \`FK_48d76e9bd5455ab7850ed75e07b\``
    );
    await queryRunner.query(`DROP TABLE \`course\``);
    await queryRunner.query(`DROP TABLE \`course-progress\``);
    await queryRunner.query(`DROP TABLE \`course_section\``);
    await queryRunner.query(`DROP TABLE \`course_content\``);
  }
}
