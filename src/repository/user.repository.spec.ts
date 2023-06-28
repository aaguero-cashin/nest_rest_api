import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import mockData from './mockData';
import { DataSource, QueryRunner } from 'typeorm';
import { CreateUserInput } from '../inputs/user.inputs';
import { verifyPassword } from '../utils/verifyPassword';
import { UUID } from 'crypto';

const instanceMockRepository = async (
  isNull: boolean,
): Promise<UserRepository> => {
  if (isNull) {
    const dataSource = new DataSource({
      type: 'sqlite',
      database: 'databaseTest.db',
      synchronize: true,
      entities: [UserEntity],
    });
    return new UserRepository(dataSource, null);
  }

  const module: TestingModule = await Test.createTestingModule({
    controllers: [UserRepository],
    imports: [
      TypeOrmModule.forRoot({
        type: 'sqlite',
        database: 'databaseTest.db',
        synchronize: true,
        entities: [UserEntity],
      }),
      TypeOrmModule.forFeature([UserEntity]),
    ],
  }).compile();

  return module.get<UserRepository>(UserRepository);
};

const insertValuesToDatabase = async (
  data: CreateUserInput[],
): Promise<UUID[]> => {
  try {
    const dataSource = new DataSource({
      type: 'sqlite',
      database: 'databaseTest.db',
      entities: [UserEntity],
    });
    const repo = await dataSource.initialize();

    const query = await repo
      .createQueryBuilder()
      .insert()
      .into(UserEntity)
      .values(data)
      .execute();

    return query.identifiers.map(({ id }) => id);
  } catch (e) {
    console.log(e);
  }
};

const cleanDatabase = async () => {
  const dataSource = new DataSource({
    type: 'sqlite',
    database: 'databaseTest.db',
    entities: [UserEntity],
  });
  const repo = await dataSource.initialize();

  repo.getRepository(UserEntity).clear();
};

describe('UserRepository', () => {
  let repository: UserRepository;
  let queryRunner: QueryRunner;

  afterEach(async () => {
    await cleanDatabase();
    if (queryRunner !== undefined) {
      await queryRunner.release();
    }
  });

  describe('create', () => {
    it('success', async () => {
      repository = await instanceMockRepository(false);

      const queryRunner = await repository.createQueryRunner();

      const response = await repository.create(
        mockData.userToCreate,
        queryRunner,
      );

      await queryRunner.commitTransaction();

      expect(response).not.toBe('');
    });

    it('success without queryRunner', async () => {
      repository = await instanceMockRepository(false);

      const response = repository.create(mockData.userToCreate);

      expect(response).resolves.not.toBe('');
    });

    it('error on query', async () => {
      repository = await instanceMockRepository(true);

      const response = repository.create(mockData.userToCreate);

      expect(response).rejects.toThrow('error on repository');
    });
  });

  describe('getAll', () => {
    it('success', async () => {
      repository = await instanceMockRepository(false);

      const isertedIds = await insertValuesToDatabase([mockData.userToCreate]);

      const response = await repository.getAll();

      expect(response[0].id).toEqual(isertedIds[0]);
      expect(response[0].email).toEqual(mockData.userToCreate.email);
      expect(response[0].userName).toEqual(mockData.userToCreate.userName);
      expect(
        verifyPassword(response[0].password, mockData.userToCreate.password),
      ).toBeTruthy();
    });

    it('error on query', async () => {
      repository = await instanceMockRepository(true);

      const response = repository.getAll();

      expect(response).rejects.toThrow('error on repository');
    });
  });

  describe('getById', () => {
    it('success', async () => {
      repository = await instanceMockRepository(false);

      const isertedIds = await insertValuesToDatabase([mockData.userToCreate]);

      const queryRunner = await repository.createQueryRunner();

      const response = await repository.getById(isertedIds[0], queryRunner);

      await queryRunner.commitTransaction();

      expect(response.id).toEqual(isertedIds[0]);
      expect(response.email).toEqual(mockData.userToCreate.email);
      expect(response.userName).toEqual(mockData.userToCreate.userName);
      expect(
        verifyPassword(response.password, mockData.userToCreate.password),
      ).toBeTruthy();
    });

    it('success without query runner', async () => {
      repository = await instanceMockRepository(false);

      const isertedIds = await insertValuesToDatabase([mockData.userToCreate]);

      const response = await repository.getById(isertedIds[0]);

      expect(response.id).toEqual(isertedIds[0]);
      expect(response.email).toEqual(mockData.userToCreate.email);
      expect(response.userName).toEqual(mockData.userToCreate.userName);
      expect(
        verifyPassword(response.password, mockData.userToCreate.password),
      ).toBeTruthy();
    });

    it('error on query', async () => {
      repository = await instanceMockRepository(true);

      const response = repository.getById(null);

      expect(response).rejects.toThrow('error on repository');
    });
  });

  describe('update', () => {
    it('success', async () => {
      repository = await instanceMockRepository(false);

      const isertedIds = await insertValuesToDatabase([mockData.userToCreate]);

      const response = await repository.update(
        isertedIds[0],
        mockData.userNewValues,
      );

      expect(response).toEqual(1);
    });

    it('error on query', async () => {
      repository = await instanceMockRepository(true);

      const response = repository.update(null, null);

      expect(response).rejects.toThrow('error on repository');
    });
  });

  describe('delete', () => {
    it('success', async () => {
      repository = await instanceMockRepository(false);

      const isertedIds = await insertValuesToDatabase([mockData.userToCreate]);

      const response = await repository.delete(isertedIds[0]);

      expect(response).toBeUndefined();
    });

    it('error on query', async () => {
      repository = await instanceMockRepository(true);

      const response = repository.delete(null);

      expect(response).rejects.toThrow('error on repository');
    });
  });

  describe('createQueryRunner', () => {
    it('success', async () => {
      repository = await instanceMockRepository(false);

      const response = await repository.createQueryRunner();

      expect(response).toMatchObject({ isReleased: false });
      expect(response).toMatchObject({ isTransactionActive: true });
    });

    it('error on creation', async () => {
      class mockQueryRunner {
        async connect(): Promise<QueryRunner> {
          throw new Error('mock error');
        }
        async release(): Promise<void> {
          return undefined;
        }
      }

      const mockDataSource = {
        createQueryRunner: jest.fn(
          (): QueryRunner => new mockQueryRunner() as any,
        ),
      };

      const module: TestingModule = await Test.createTestingModule({
        controllers: [UserRepository],
        imports: [
          TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'databaseTest.db',
            synchronize: true,
            entities: [UserEntity],
          }),
          TypeOrmModule.forFeature([UserEntity]),
        ],
        providers: [
          {
            provide: DataSource,
            useValue: mockDataSource,
          },
        ],
      }).compile();

      repository = module.get<UserRepository>(UserRepository);

      const response = repository.createQueryRunner();

      expect(response).rejects.toThrow('error on repository');

      jest.clearAllMocks();
    });
  });

  describe('commitTransaction', () => {
    it('success', async () => {
      const mockQueryRunner: any = {
        commitTransaction: jest.fn(async () => null),
      };

      repository = new UserRepository(null, null);

      await repository.commitTransaction(mockQueryRunner);

      expect(mockQueryRunner.commitTransaction).toHaveBeenCalledTimes(1);
    });
  });

  describe('rollbackTransaction', () => {
    it('success', async () => {
      const mockQueryRunner: any = {
        rollbackTransaction: jest.fn(async () => null),
      };

      repository = new UserRepository(null, null);

      await repository.rollbackTransaction(mockQueryRunner);

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalledTimes(1);
    });
  });

  describe('releaseTransaction', () => {
    it('success', async () => {
      const mockQueryRunner: any = {
        release: jest.fn(async () => null),
      };

      repository = new UserRepository(null, null);

      await repository.releaseTransaction(mockQueryRunner);

      expect(mockQueryRunner.release).toHaveBeenCalledTimes(1);
    });
  });
});
