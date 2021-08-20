import { repository } from '@loopback/repository';
import { CountriesRepository, HolidaysRepository } from '../repositories';;
import { ApplicationConfig, LemonholidaysApplication } from '../application';
import dotenv from 'dotenv';

class FillDbWithHolidaysScript {
  constructor(
    @repository(CountriesRepository)
    public countriesRepository: CountriesRepository,
    @repository(CountriesRepository)
    public holidaysRepository: HolidaysRepository,
  ) {
  }

  async run() {
    const startYear = 2009;
    const endYear = 2021;
    const countries = await this.countriesRepository.find({});

    if (countries) {
      for (const country of countries) {
        console.log(country);

        for (let currentYear = startYear; currentYear <= endYear; currentYear++) {
          await this.createHolidayByCountryAndYear(currentYear, country.code);
        }
      }
    }

    console.log('Holiday is populated 🥳')
    process.exit(0);
  }

  async createHolidayByCountryAndYear(year: number, countryCode: string) {
    let dataSource = "Google";

    if (countryCode.toLowerCase() === "cl") {
      dataSource = "APIChile";
    }

    try {
      await this.holidaysRepository.createAllByCountry(year, countryCode, dataSource);
    } catch (error) {
      console.log("ERROR CREATE HOLIDAYS (" + countryCode.toUpperCase() + ") IN YEAR: " + year + ":", error.message);
    }

    return;
  }
}

async function main(options: ApplicationConfig = {}) {
  dotenv.config();

  const app = new LemonholidaysApplication(options);
  await app.boot();

  app.bind('datasources.config.mongoHolidays').to({
    name: 'mongoHolidays',
    connector: 'mongodb',
    url: process.env.MONGO_URL,
    host: process.env.MONGO_HOST,
    port: process.env.MONGO_PORT,
    user: process.env.MONGO_USER,
    password: process.env.MONGO_PASS,
    database: process.env.MONGO_DB,
    useNewUrlParser: true
  });

  await app.start();

  const holidaysRepository = app.repository(HolidaysRepository);
  const holidaysRepositoryInstance = await holidaysRepository.getValue(app);
  const countriesRepository = app.repository(CountriesRepository);
  const countriesRepositoryInstance = await countriesRepository.getValue(app);
  const fillDbScript = new FillDbWithHolidaysScript(countriesRepositoryInstance, holidaysRepositoryInstance);

  await fillDbScript.run();

  return app;
}

const config = {};

main(config).catch((error) => {
  console.error('ERROR EXECUTE SCRIPT:', error);
  process.exit(1);
});
