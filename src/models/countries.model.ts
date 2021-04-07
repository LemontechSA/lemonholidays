import {Entity, model, property} from '@loopback/repository';

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

  constructor(data?: Partial<Countries>) {
    super(data);
  }
}

export interface CountriesRelations {
  // describe navigational properties here
}

export type CountriesWithRelations = Countries & CountriesRelations;
