import {Entity, model, property} from '@loopback/repository';

@model()
export class Applications extends Entity {
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
    type: 'string',
    required: true,
  })
  key: string;

  constructor(data?: Partial<Applications>) {
    super(data);
  }
}
