import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCoursesEntities1734092091678 implements MigrationInterface {
  name = 'AddCoursesEntities1734092091678';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`course_content\` 
        (\`id\` int NOT NULL AUTO_INCREMENT, 
          \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
          \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), 
          \`deletedAt\` datetime(6) NULL, \`title\` varchar(100) NOT NULL, 
          \`description\` text NULL, \`content_url\` varchar(255) NOT NULL, 
          \`content_type\` enum ('article', 'video', 'quiz', 'game') NOT NULL DEFAULT 'video', 
          \`course_section_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`course_section\` 
    (\`id\` int NOT NULL AUTO_INCREMENT, 
      \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
      \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), 
      \`deletedAt\` datetime(6) NULL, \`title\` varchar(100) NOT NULL, \`description\` text NULL, 
      \`course_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`course\` 
        (\`id\` int NOT NULL AUTO_INCREMENT, 
        \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
        \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), 
        \`deletedAt\` datetime(6) NULL, \`title\` varchar(100) NOT NULL, 
        \`description\` text NULL, 
        \`teacher_id\` int NOT NULL, PRIMARY KEY (\`id\`))
         ENGINE=InnoDB`
    );
    await queryRunner.query(
      `ALTER TABLE \`course_content\` 
        ADD CONSTRAINT \`FK_48d76e9bd5455ab7850ed75e07b\` 
        FOREIGN KEY (\`course_section_id\`) REFERENCES \`course_section\`(\`id\`) 
        ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`course_section\` 
        ADD CONSTRAINT \`FK_96e2b12714357c99e42ca45be9c\` 
        FOREIGN KEY (\`course_id\`) REFERENCES \`course\`(\`id\`) 
        ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`course\` 
        ADD CONSTRAINT \`FK_f4acb7f54962af04a558b1a5ed9\` 
        FOREIGN KEY (\`teacher_id\`) REFERENCES \`users\`(\`id\`) 
        ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`course\` DROP FOREIGN KEY \`FK_f4acb7f54962af04a558b1a5ed9\``
    );
    await queryRunner.query(
      `ALTER TABLE \`course_section\` DROP FOREIGN KEY \`FK_96e2b12714357c99e42ca45be9c\``
    );
    await queryRunner.query(
      `ALTER TABLE \`course_content\` DROP FOREIGN KEY \`FK_48d76e9bd5455ab7850ed75e07b\``
    );
    await queryRunner.query(`DROP TABLE \`course\``);
    await queryRunner.query(`DROP TABLE \`course_section\``);
    await queryRunner.query(`DROP TABLE \`course_content\``);
  }
}
