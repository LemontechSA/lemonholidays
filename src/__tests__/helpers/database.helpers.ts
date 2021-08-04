import { Applications, User, UserCredentials } from '../../models';

export function givenApplicationData(application?: Partial<Applications>) {
  const data = Object.assign({
      name: 'applications test',
      key: '<key-ds>',
    },
    application,
  );

  return new Applications(data);
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
