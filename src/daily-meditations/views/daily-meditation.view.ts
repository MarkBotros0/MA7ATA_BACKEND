import { DailyMeditation } from '../entities/daily-meditation.entity';

export class DailyMeditationView {
  constructor(private readonly data: DailyMeditation | DailyMeditation[]) {}

  render() {
    if (Array.isArray(this.data)) {
      return this.data.map((course) => this.renderDailyMeditation(course));
    }
    return this.renderDailyMeditation(this.data);
  }

  private renderDailyMeditation(dailyMeditation: DailyMeditation): any {
    const dailyMeditationData: Partial<DailyMeditation> = {
      id: dailyMeditation.id,
      title: dailyMeditation.title,
      article: dailyMeditation.article,
      day: dailyMeditation.day,
      month: dailyMeditation.month,
      year: dailyMeditation.year,
      createdAt: dailyMeditation.createdAt
    };

    return {
      ...dailyMeditationData
    };
  }
}
