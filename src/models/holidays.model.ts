import {Entity, model, property} from '@loopback/repository';

@model()
export class Holidays extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'date',
    required: true,
  })
  date: string;

  @property({
    type: 'string',
    required: true,
  })
  type: string;

  @property({
    type: 'string',
  })
  origin?: string;

  @property({
    type: 'string',
    required: true,
  })
  country: string;

  @property({
    type: 'date',
  })
  created_at?: string;

  @property({
    type: 'date',
  })
  updated_at?: string;


  constructor(data?: Partial<Holidays>) {
    super(data);
  }
}

export interface HolidaysRelations {
  // describe navigational properties here
}

export type HolidaysWithRelations = Holidays & HolidaysRelations;
