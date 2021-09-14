import {Entity, model, property} from '@loopback/repository';

@model()
export class Countries extends Entity {
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
  code: string;

  @property({
    type: 'string',
    required: true,
  })
  origin: string;

  @property({
    type: 'string',
    required: true
  })
  googleCode: string;

  constructor(data?: Partial<Countries>) {
    super(data);
  }
}
