import { CreateUserInput, UpdateUserInput } from 'src/inputs/user.inputs';

const userToCreate: CreateUserInput = {
  email: 'test@test.com',
  userName: 'test',
  password: '123456',
};

const userNewValues: UpdateUserInput = {
  email: 'test2@test.com',
  userName: 'test2',
  password: '1234567',
};

export default {
  userToCreate,
  userNewValues,
};
