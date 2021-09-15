/* eslint-disable @typescript-eslint/no-explicit-any */
import { injectable, BindingScope } from '@loopback/core';
import { Holidays } from '../models';

@injectable({ scope: BindingScope.TRANSIENT })
export class GoogleApiTransformerService {
  private origin = 'Google';

  /*
   * Add service methods here
   */
  async transformer(data: any, country: string): Promise<Array<Holidays>> {
    const dataTranformer = [];
    if (data) {

      if (Object.prototype.hasOwnProperty.call(data, 'items')) {
        for (const item of data.items) {
          const model = new Holidays();

          if (Object.prototype.hasOwnProperty.call(item, 'summary')) {
            model.name = item['summary'];
          }

          if (Object.prototype.hasOwnProperty.call(item, 'start')) {
            model.date = new Date(item['start']['date']);
          }
          model.country = country;
          model.origin = this.origin;
          model.active = true;
          model.createdAt = new Date();
          model.type = 'Festivo';
          dataTranformer.push(model);
        }

      }
    }
    return dataTranformer;

  }
}
