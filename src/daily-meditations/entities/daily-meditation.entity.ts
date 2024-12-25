import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';

@Entity({ name: 'daily-meditations' })
export class DailyMeditation extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  article: string;

  @Column({ type: 'int' })
  day: number;

  @Column({ type: 'int' })
  month: number;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'text', nullable: true, name: 'photo_url' })
  photoUrl: string;
}
