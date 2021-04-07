import {CronJob, cronJob} from '@loopback/cron';

@cronJob()
export class CronUpdateHolidays extends CronJob {
  constructor() {
    super({
      name: 'update-holidays',
      onTick: () => {
        this.updateHoliday();
      },
      cronTime: '*/10 * * * * *', // Cada 10 segundos
      start: true,
    });
  }
  updateHoliday() {
    const date : Date = new Date();
    console.log('Update Holiday is running 🥳. '+ date);
  }
}
