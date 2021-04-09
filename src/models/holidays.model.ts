import {Entity, model, property} from '@loopback/repository';

@model()
export class Holidays extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'date',
    required: true,
  })
  date: Date;

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
  createdAt?: Date;

  @property({
    type: 'date',
  })
  updatedAt?: Date;

  constructor(data?: Partial<Holidays>) {
    super(data);
  }
}

export interface HolidaysRelations {
  // describe navigational properties here
}

export type HolidaysWithRelations = Holidays & HolidaysRelations;
