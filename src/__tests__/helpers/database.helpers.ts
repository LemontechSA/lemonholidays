import { Applications } from '../../models';

export function givenApplicationData(application?: Partial<Applications>) {
  const data = Object.assign({
      name: 'applications test',
      key: '<key-ds>',
    },
    application,
  );

  return new Applications(data);
}
