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
    cron.schedule('0 20 3 */16 * *', async () => {
      const date: Date = new Date();
      console.log('Update Holiday is running 🥳. ' + date);
      await this.holidaysRepository.createOrUpdate();
    });
  }

}