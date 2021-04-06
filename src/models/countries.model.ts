import {Entity, model, property, hasMany} from '@loopback/repository';
import {Holidays} from './holidays.model';

@model()
export class Countries extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    defaultFn: "guid"
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  code: string;

  @hasMany(() => Holidays)
  holidays?: Holidays[];

  constructor(data?: Partial<Countries>) {
    super(data);
  }
}

export interface CountriesRelations {
  // describe navigational properties here
}

export type CountriesWithRelations = Countries & CountriesRelations;
