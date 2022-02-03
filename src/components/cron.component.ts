import { repository } from '@loopback/repository';
import { HolidaysRepository } from '../repositories';
const cron = require('node-cron');

export class CronComponent {
  constructor(
    @repository(HolidaysRepository)
    public holidaysRepository: HolidaysRepository,
  ) {
  }

  async start() {
    cron.schedule(process.env.CRON_SCHEDULE, async () => {
      const date: Date = new Date();
      console.log('Update Holiday is running 🥳. ' + date);
      await this.holidaysRepository.createOrUpdate();
    });
  }
}
