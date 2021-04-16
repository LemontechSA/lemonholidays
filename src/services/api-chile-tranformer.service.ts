/* eslint-disable @typescript-eslint/no-explicit-any */
import { injectable, /* inject, */ BindingScope } from '@loopback/core';
import { Holidays } from '../models/holidays.model';

@injectable({ scope: BindingScope.TRANSIENT })
export class ApiChileTranformerService {
  private country = 'cl';
  private origin = 'APIChile';

  constructor(/* Add @inject to inject parameters */) { }

  /*
   * Add service methods here
   */
  async transformer(data: Array<any>): Promise<Holidays[]> {
    const dataTranformer: Holidays[] = [];

    if (data) {

      for (const item of data) {
        const model = new Holidays();

        if (Object.prototype.hasOwnProperty.call(item, 'nombre')) {
          model.name = item['nombre'];
        }

        if (Object.prototype.hasOwnProperty.call(item, 'fecha')) {
          model.date = new Date(item['fecha']);
        }

        model.country = this.country;
        model.origin = this.origin;
        model.active = true;
        model.createdAt = new Date();
        model.type = item['tipo'];


        dataTranformer.push(model);
      }

    }
    return dataTranformer;

  }
}
