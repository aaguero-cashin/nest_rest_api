import { UUID } from 'crypto';
import { UserEntity } from 'src/entity/user.entity';
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

const userId: UUID = '313d669d-efd2-42bd-9b46-938602c4bfd6';

const userCreated: UserEntity = {
  id: '313d669d-efd2-42bd-9b46-938602c4bfd6',
  email: 'test@test.com',
  userName: 'test',
  password: '123456',
};

export default {
  userToCreate,
  userNewValues,
  userId,
  userCreated,
};
