/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { MongoHolidaysDataSource } from '../datasources';
import { Holidays, HolidaysRelations } from '../models';
import { ApichileService, GoogleCalProvider, GoogleApiTransformerService, ApiChileTranformerService } from '../services';
import { CountriesRepository } from '../repositories';

export class HolidaysRepository extends DefaultCrudRepository<
  Holidays,
  typeof Holidays.prototype.id,
  HolidaysRelations
> {
  constructor(
    @inject('datasources.mongoHolidays')
    dataSource: MongoHolidaysDataSource,
    @inject('services.ApichileService')
    protected apichileService: ApichileService,
    @inject('services.ApiChileTranformerService')
    protected apiChileTranformerService: ApiChileTranformerService,
    @inject('services.GoogleCalProvider')
    private googleCal: GoogleCalProvider,
    @inject('services.GoogleApiTransformerService')
    private googleApiTransformerService: GoogleApiTransformerService,
    @inject('repositories.CountriesRepository')
    private countriesRepository: CountriesRepository
  ) {
    super(Holidays, dataSource);
  }

  async findByCountry(country: string, year?: number) {
    if (!year) {
      year = new Date().getFullYear();
    }
    const first = new Date(`${year}-01-01T00:00:00`);
    const last = new Date(`${year}-12-31T23:59:59`);

    return this.find({
      where: {
        and: [
          {
            country: country
          },
          {
            date: { between: [first, last] }
          }
        ]
      }
    })

  }

  async createOrUpdate() {
    const countries = await this.countriesRepository.find();
    for (const country of countries) {
      const countItem = await this.find({ where: { country: country.code } });
      if (countItem.length === 0) {
        await this.createAllByCountry(new Date().getFullYear(), country.code, country.origin);
        continue;
      }

      await this.updateAllByCountry(country.code, country.origin);
    }
    return null;
  }

  async createAllByCountry(year: number, country: string, typeApi: string): Promise<any> {
    const holidaysApi: any = await this.getHolidayApis(year, country, typeApi);
    await this.createAll(holidaysApi);
  }

  async getHolidayApis(year: number, country: string, typeApi: string): Promise<Array<Holidays>> {
    let holidaysApi: Array<Holidays> = [];
    if (typeApi === 'Google') {
      const eventList = await this.googleCal.holidayEvents(year, country);
      holidaysApi = await this.googleApiTransformerService.transformer(eventList.data, country);
    } else if (typeApi === 'APIChile') {
      const data = await this.apichileService.holidaysByYear(year);
      holidaysApi = await this.apiChileTranformerService.transformer(data);
    }
    return holidaysApi;
  }

  async updateAllByCountry(country: string, typeApi: string): Promise<any> {
    const year = new Date().getFullYear();
    const first = new Date(`${year}-01-01T00:00:00Z`);
    const last = new Date(`${year}-12-31T23:59:59Z`);
    const currentDay = new Date();
    currentDay.setHours(0, 0, 0, 0);

    const holidays = await this.find({
      order: ["date ASC"],
      where: { and: [{ country: country }, { date: { between: [first, last] } }], }
    })
    const holidaysApi: Holidays[] = await this.getHolidayApis(year, country, typeApi)

    await this.searchingHolidaysApi(holidays, holidaysApi, currentDay);
    await this.searchingHolidaysBD(holidays, holidaysApi, currentDay);

  }

  //Metodo que retorna la diferencia entre dos array de objetos
  diff(otherArray: Holidays[]) {
    return function (current: Holidays) {
      return otherArray.filter((other: Holidays) => {
        return other.name === current.name && other.country === current.country
          && other.date.toString() === current.date.toString()
      }).length === 0;
    }
  }

  async searchingHolidaysBD(holidays: Holidays[], holidaysApi: Holidays[], currentDay: Date) {
    //Busco si hay feriados en la base de datos que no existan en las apis
    const missingHolidays = holidays.filter(this.diff(holidaysApi));
    //si existen los desactivo si su origen es distinto a Manual y es mayor o igual a la fecha actual
    if (missingHolidays.length > 0) {
      for (const holiday of missingHolidays) {
        if (holiday.origin !== 'Manual' && holiday.date >= currentDay) {
          holiday.active = false;
          holiday.updatedAt = new Date();
          await this.update(holiday);
        }
      }
    }
  }

  async searchingHolidaysApi(holidays: Holidays[], holidaysApi: Holidays[], currentDay: Date) {
    //busco si hay feriados en la api que no  existan en base de datos
    const missingHolidayApi = holidaysApi.filter(this.diff(holidays));
    if (missingHolidayApi.length > 0) {
      for (const holiday of missingHolidayApi) {
        const holidayFind = await this.findOne({
          where: {
            date: holiday.date,
            country: holiday.country,
            active: true
          }
        });
        await this.createAndUpdateHolidays(holidayFind, holiday, currentDay);
      }
    }
  }

  async createAndUpdateHolidays(holidayFind: Holidays | null, holiday: Holidays, currentDay: Date) {
    //si el feriado de la Api no se encuentra en base de datos y es mayor o igual a la fecha actual se crea
    if (holidayFind === null) {
      if (holiday.date >= currentDay) {
        await this.create(holiday);
      }
      return;
    }

    //si existe en la base de datos, el feriado se desactiva si el origen es distinto a Manual y mayor o igual a la fecha actual
    //ademas se crea un nuevo feriado
    if (holidayFind.origin !== 'Manual' && holidayFind.date >= currentDay) {
      holidayFind.active = false;
      holidayFind.updatedAt = new Date();
      await this.updateById(holidayFind.id, holidayFind);
      await this.create(holiday);
    }
  }

}

