import { Applications, User, UserCredentials, Countries, Holidays } from '../../models';

export function givenApplicationData(application?: Partial<Applications>) {
  const data = Object.assign({
    name: 'applications test',
    key: '<key-ds>',
  },
    application,
  );

  return new Applications(data);
}

export function givenCountryData(country?: Partial<Countries>) {
  const data = Object.assign({
    name: 'Chile',
    code: "cl",
    origin: "APIChile",
    googleCode: "cl"
  },
    country,
  );

  return new Countries(data);
}

export function givenHolidayData(holiday?: Partial<Holidays>) {
  const data = Object.assign({
    name: "Feriado Test",
    date: new Date(),
    type: "Civil",
    origin: "APIChile",
    country: "cl",
    active: true,
    createdAt: new Date()
  },
    holiday,
  );

  return new Holidays(data);
}

export function givenUserData(user?: Partial<User>) {
  const data = Object.assign({
    id: 'mogo-id-obj',
    email: 'admin@email.com',
  },
    user,
  );

  return new User(data);
}

export function givenUserCredentialsData(user?: Partial<UserCredentials>) {
  const data = Object.assign({
    id: 'mogo-id-obj-2',
    password: 'secure-password',
    userId: 'mogo-id-obj',
  },
    user,
  );

  return new UserCredentials(data);
}
