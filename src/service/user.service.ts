import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { UserEntity } from 'src/entity/user.entity';
import { CreateUserInput, UpdateUserInput } from 'src/inputs/user.inputs';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class UserService {
  constructor(protected readonly _repository: UserRepository) {}

  async create(data: CreateUserInput): Promise<UserEntity | undefined> {
    const queryRunner = await this._repository.createQueryRunner();

    try {
      const id = await this._repository.create(data, queryRunner);

      const response = await this._repository.getById(id, queryRunner);

      await this._repository.commitTransaction(queryRunner);

      return response;
    } catch (e) {
      console.log(e);
      await this._repository.rollbackTransaction(queryRunner);
      throw new Error('error on service');
    } finally {
      await this._repository.releaseTransaction(queryRunner);
    }
  }

  async getAll(): Promise<UserEntity[] | undefined> {
    try {
      const response = await this._repository.getAll();

      return response;
    } catch (e) {
      console.log(e);
      throw new Error('error on service');
    }
  }

  async getById(id: UUID): Promise<UserEntity | undefined> {
    try {
      const response = await this._repository.getById(id);

      if (!response) {
        console.log('this id has no found');
        throw new Error('no content');
      }

      return response;
    } catch (e) {
      console.log(e);
      throw new Error('error on service');
    }
  }

  async update(id: UUID, data: UpdateUserInput) {
    try {
      const response = await this._repository.update(id, data);

      if (!response) {
        console.log('this id has no found');
        throw new Error('no content');
      }
    } catch (e) {
      console.log(e);
      throw new Error('error on service');
    }
  }

  async delete(id: UUID) {
    try {
      await this._repository.getById(id);

      await this._repository.delete(id);
    } catch (e) {
      console.log(e);
      throw new Error('error on service');
    }
  }
}
