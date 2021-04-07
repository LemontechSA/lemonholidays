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
    type: 'boolean',
    required: true,
  })
  active: boolean;

  @property({
    type: 'date',
  })
  createdAt?: string;

  @property({
    type: 'date',
  })
  updatedAt?: string;

  constructor(data?: Partial<Holidays>) {
    super(data);
  }
}

export interface HolidaysRelations {
  // describe navigational properties here
}

export type HolidaysWithRelations = Holidays & HolidaysRelations;
