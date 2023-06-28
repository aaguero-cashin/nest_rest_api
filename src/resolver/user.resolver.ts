import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserEntity } from '../entity/user.entity';
import { UserService } from '../service/user.service';
import { UUID } from 'crypto';

@Resolver()
export class UserResolver {
  constructor(private readonly _service: UserService) {}

  @Mutation(() => UserEntity)
  async createUser(@Args() data: UserEntity) {
    return this._service.create(data);
  }

  @Query(() => [UserEntity])
  async getAllUser() {
    return this._service.getAll();
  }

  @Query(() => UserEntity)
  async getByIdUser(
    @Args({
      name: 'id',
      type: () => String,
      nullable: false,
    })
    id: UUID,
  ) {
    return this._service.getById(id);
  }

  @Mutation(() => String)
  async updateUser(
    @Args({
      name: 'id',
      type: () => String,
      nullable: false,
    })
    id: UUID,
    @Args() data: UserEntity,
  ) {
    await this._service.update(id, data);
    return 'user was updated';
  }

  @Mutation(() => String)
  async deleteUser(
    @Args({
      name: 'id',
      type: () => String,
      nullable: false,
    })
    id: UUID,
  ) {
    await this._service.delete(id);
    return 'user was deleted';
  }
}
