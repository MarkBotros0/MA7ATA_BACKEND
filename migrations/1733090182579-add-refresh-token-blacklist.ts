import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRefreshTokenBlacklist1733090182579
  implements MigrationInterface
{
  name = 'AddRefreshTokenBlacklist1733090182579';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`blacklisted_refresh_tokens\` (
        \`id\` int NOT NULL AUTO_INCREMENT, 
        \`token\` text NOT NULL, 
        \`expired_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
        \`userId\` int NULL, 
        PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, 
        \`phone_number\` varchar(15) NOT NULL, 
        \`fullname\` varchar(100) NULL, 
        \`email\` varchar(30) NULL, 
        \`password\` text NULL, 
        \`user_roles\` set ('Normal', 'Instructor', 'Admin') NOT NULL DEFAULT 'Normal', 
        \`gender\` set ('Male', 'Female') NULL, \`date_of_birth\` date NULL, 
        \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
        \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), 
        \`deletedAt\` datetime(6) NULL, 
        UNIQUE INDEX \`IDX_17d1817f241f10a3dbafb169fd\` (\`phone_number\`), 
        PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`otp_code\` (
        \`phone_number\` varchar(15) NOT NULL, 
        \`otp\` text NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`blacklisted_refresh_tokens\` 
        DROP FOREIGN KEY \`FK_2095e3424fe134cf237a081772b\``
    );
    await queryRunner.query(`DROP TABLE \`otp_code\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_17d1817f241f10a3dbafb169fd\` ON \`users\``
    );
    await queryRunner.query(`DROP TABLE \`users\``);
    await queryRunner.query(`DROP TABLE \`blacklisted_refresh_tokens\``);
  }
}
