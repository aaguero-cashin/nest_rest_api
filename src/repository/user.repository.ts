import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entity/user.entity';
import {
  DataSource,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { CreateUserInput, UpdateUserInput } from '../inputs/user.inputs';
import { UUID } from 'crypto';

@Injectable()
export class UserRepository {
  constructor(
    protected readonly _dataSource: DataSource,
    @InjectRepository(UserEntity)
    protected readonly _repo: Repository<UserEntity>,
  ) {}

  async create(
    data: CreateUserInput,
    queryRunner?: QueryRunner,
  ): Promise<UUID | undefined> {
    let queryBuilder: SelectQueryBuilder<UserEntity>;

    try {
      if (queryRunner) {
        queryBuilder = this._repo.createQueryBuilder('user', queryRunner);
      } else {
        queryBuilder = this._repo.createQueryBuilder('user');
      }

      const query = await queryBuilder
        .insert()
        .into(UserEntity)
        .values({ ...data })
        .execute();

      return query.identifiers[0].id;
    } catch (e) {
      console.log(e);
      throw new Error('error on repository');
    }
  }

  async getAll(): Promise<UserEntity[] | undefined> {
    try {
      const query = await this._repo.createQueryBuilder('user').getMany();

      return query;
    } catch (e) {
      console.log(e);
      throw new Error('error on repository');
    }
  }

  async getById(
    id: UUID,
    queryRunner?: QueryRunner,
  ): Promise<UserEntity | undefined> {
    let queryBuilder: SelectQueryBuilder<UserEntity>;

    try {
      if (queryRunner) {
        queryBuilder = this._repo.createQueryBuilder('user', queryRunner);
      } else {
        queryBuilder = this._repo.createQueryBuilder('user');
      }

      const query = await queryBuilder.where({ id }).getOne();

      return query;
    } catch (e) {
      console.log(e);
      throw new Error('error on repository');
    }
  }

  async update(id: UUID, data: UpdateUserInput): Promise<number | undefined> {
    try {
      const query = await this._repo
        .createQueryBuilder('user')
        .where('id = :id', { id })
        .update<UserEntity>(UserEntity, { ...data })
        .updateEntity(true)
        .execute();

      return query.affected;
    } catch (e) {
      console.log(e);
      throw new Error('error on repository');
    }
  }

  async delete(id: UUID) {
    try {
      await this._repo
        .createQueryBuilder('user')
        .where('id = :id', { id })
        .delete()
        .execute();
    } catch (e) {
      console.log(e);
      throw new Error('error on repository');
    }
  }

  async createQueryRunner(): Promise<QueryRunner | undefined> {
    const queryRunner = this._dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      return queryRunner;
    } catch (e) {
      console.log(e);
      throw new Error('error on repository');
    } finally {
      await queryRunner.release();
    }
  }

  async commitTransaction(queryRunner: QueryRunner) {
    await queryRunner.commitTransaction();
  }

  async rollbackTransaction(queryRunner: QueryRunner) {
    await queryRunner.rollbackTransaction();
  }

  async releaseTransaction(queryRunner: QueryRunner) {
    await queryRunner.release();
  }
}
