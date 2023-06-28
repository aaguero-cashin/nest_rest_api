import { Test, TestingModule } from '@nestjs/testing';
import { UserEntity } from '../entity/user.entity';
import { UserService } from './user.service';
import { UserRepository } from '../repository/user.repository';
import { UUID } from 'crypto';
import mockData from './mockData';
import { QueryRunner } from 'typeorm';

describe('UserService', () => {
  let service: UserService;

  const mockRepository = {
    create: jest.fn(async (): Promise<UUID | undefined> => null),
    getAll: jest.fn(async (): Promise<UserEntity[] | undefined> => null),
    getById: jest.fn(async (): Promise<UserEntity | undefined> => null),
    update: jest.fn(async () => null),
    delete: jest.fn(async () => null),
    createQueryRunner: jest.fn(
      async (): Promise<QueryRunner | undefined> => undefined,
    ),
    commitTransaction: jest.fn(async (): Promise<void> => undefined),
    rollbackTransaction: jest.fn(async (): Promise<void> => undefined),
    releaseTransaction: jest.fn(async (): Promise<void> => undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserService],
      providers: [
        {
          provide: UserRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('success', async () => {
      const fnRepositoryCreateQueryRunner = jest
        .spyOn(mockRepository, 'createQueryRunner')
        .mockImplementation(async () => undefined);

      const fnRepositoryCreate = jest
        .spyOn(mockRepository, 'create')
        .mockImplementation(async () => Promise.resolve(mockData.userId));

      const fnRepositoryGetById = jest
        .spyOn(mockRepository, 'getById')
        .mockImplementation(async () => Promise.resolve(mockData.userCreated));

      const fnRepositoryCommitTransaction = jest
        .spyOn(mockRepository, 'commitTransaction')
        .mockImplementation(async () => undefined);

      const fnRepositoryReleaseTransaction = jest
        .spyOn(mockRepository, 'commitTransaction')
        .mockImplementation(async () => undefined);

      const response = await service.create(mockData.userToCreate);

      expect(fnRepositoryCreateQueryRunner).toHaveBeenCalledTimes(1);
      expect(fnRepositoryCreate).toHaveBeenCalledTimes(1);
      expect(fnRepositoryCreate).toHaveBeenCalledWith(
        mockData.userToCreate,
        undefined,
      );
      expect(fnRepositoryGetById).toHaveBeenCalledTimes(1);
      expect(fnRepositoryGetById).toHaveBeenCalledWith(
        mockData.userId,
        undefined,
      );
      expect(fnRepositoryCommitTransaction).toHaveBeenCalledTimes(1);
      expect(fnRepositoryCommitTransaction).toHaveBeenCalledWith(undefined);
      expect(fnRepositoryReleaseTransaction).toHaveBeenCalledTimes(1);
      expect(fnRepositoryReleaseTransaction).toHaveBeenCalledWith(undefined);
      expect(response).toStrictEqual(mockData.userCreated);
    });

    it('error on repository create', async () => {
      const fnRepositoryCreateQueryRunner = jest
        .spyOn(mockRepository, 'createQueryRunner')
        .mockImplementation(async () => undefined);

      const fnRepositoryCreate = jest
        .spyOn(mockRepository, 'create')
        .mockImplementation(async () =>
          Promise.reject(new Error('mock error')),
        );

      const fnRepositoryRollbackTransaction = jest
        .spyOn(mockRepository, 'rollbackTransaction')
        .mockImplementation(async () => undefined);

      try {
        await service.create(mockData.userToCreate);
      } catch (e) {
        expect(fnRepositoryCreateQueryRunner).toHaveBeenCalledTimes(1);
        expect(fnRepositoryCreate).toHaveBeenCalledTimes(1);
        expect(fnRepositoryCreate).toHaveBeenCalledWith(
          mockData.userToCreate,
          undefined,
        );
        expect(fnRepositoryRollbackTransaction).toHaveBeenCalledTimes(1);
        expect(fnRepositoryRollbackTransaction).toHaveBeenCalledWith(undefined);
        expect(e.message).toEqual('error on service');
      }
    });

    it('error on repository getById', async () => {
      const fnRepositoryCreateQueryRunner = jest
        .spyOn(mockRepository, 'createQueryRunner')
        .mockImplementation(async () => undefined);

      const fnRepositoryCreate = jest
        .spyOn(mockRepository, 'create')
        .mockImplementation(async () => Promise.resolve(mockData.userId));

      const fnRepositoryGetById = jest
        .spyOn(mockRepository, 'getById')
        .mockImplementation(async () =>
          Promise.reject(new Error('mock error')),
        );

      const fnRepositoryRollbackTransaction = jest
        .spyOn(mockRepository, 'rollbackTransaction')
        .mockImplementation(async () => undefined);

      try {
        await service.create(mockData.userToCreate);
      } catch (e) {
        expect(fnRepositoryCreateQueryRunner).toHaveBeenCalledTimes(1);
        expect(fnRepositoryCreate).toHaveBeenCalledTimes(1);
        expect(fnRepositoryCreate).toHaveBeenCalledWith(
          mockData.userToCreate,
          undefined,
        );
        expect(fnRepositoryGetById).toHaveBeenCalledTimes(1);
        expect(fnRepositoryGetById).toHaveBeenCalledWith(
          mockData.userId,
          undefined,
        );
        expect(fnRepositoryRollbackTransaction).toHaveBeenCalledTimes(1);
        expect(fnRepositoryRollbackTransaction).toHaveBeenCalledWith(undefined);
        expect(e.message).toEqual('error on service');
      }
    });
  });

  describe('getAll', () => {
    it('success', async () => {
      const fnRepositoryGetAll = jest
        .spyOn(mockRepository, 'getAll')
        .mockImplementation(async () => [mockData.userCreated]);

      const response = service.getAll();

      expect(fnRepositoryGetAll).toHaveBeenCalledTimes(1);
      expect(response).resolves.toStrictEqual([mockData.userCreated]);
    });

    it('error on repository getAll', async () => {
      const fnRepositoryGetAll = jest
        .spyOn(mockRepository, 'getAll')
        .mockImplementation(async () =>
          Promise.reject(new Error('mock error')),
        );

      const response = service.getAll();

      expect(fnRepositoryGetAll).toHaveBeenCalledTimes(1);
      expect(response).rejects.toThrow('error on service');
    });
  });

  describe('getById', () => {
    it('success', async () => {
      const fnRepositoryGetById = jest
        .spyOn(mockRepository, 'getById')
        .mockImplementation(async () => Promise.resolve(mockData.userCreated));

      const response = service.getById(mockData.userId);

      expect(fnRepositoryGetById).toHaveBeenCalledTimes(1);
      expect(fnRepositoryGetById).toHaveBeenCalledWith(mockData.userId);
      expect(response).resolves.toStrictEqual(mockData.userCreated);
    });

    it('error, id is not found', async () => {
      const fnRepositoryGetById = jest
        .spyOn(mockRepository, 'getById')
        .mockImplementation(async () => Promise.resolve(undefined));

      try {
        await service.getById(mockData.userId);
      } catch (e) {
        expect(fnRepositoryGetById).toHaveBeenCalledTimes(1);
        expect(fnRepositoryGetById).toHaveBeenCalledWith(mockData.userId);
        expect(e.message).toEqual('error on service');
      }
    });

    it('error on repository getById', async () => {
      const fnRepositoryGetById = jest
        .spyOn(mockRepository, 'getById')
        .mockImplementation(async () => Promise.reject('mock error'));

      const response = service.getById(mockData.userId);

      expect(fnRepositoryGetById).toHaveBeenCalledTimes(1);
      expect(fnRepositoryGetById).toHaveBeenCalledWith(mockData.userId);
      expect(response).rejects.toThrow('error on service');
    });
  });

  describe('update', () => {
    it('success', async () => {
      const fnRepositoryUpdate = jest
        .spyOn(mockRepository, 'update')
        .mockImplementation(async () => Promise.resolve(1));

      await service.update(mockData.userId, mockData.userNewValues);

      expect(fnRepositoryUpdate).toHaveBeenCalledTimes(1);
      expect(fnRepositoryUpdate).toHaveBeenCalledWith(
        mockData.userId,
        mockData.userNewValues,
      );
    });

    it('error, id is not found', async () => {
      const fnRepositoryUpdate = jest
        .spyOn(mockRepository, 'update')
        .mockImplementation(async () => 0);

      try {
        await service.update(mockData.userId, mockData.userNewValues);
      } catch (e) {
        expect(fnRepositoryUpdate).toHaveBeenCalledTimes(1);
        expect(fnRepositoryUpdate).toHaveBeenCalledWith(
          mockData.userId,
          mockData.userNewValues,
        );
        expect(e.message).toEqual('error on service');
      }
    });

    it('error on repository getById', async () => {
      const fnRepositoryUpdate = jest
        .spyOn(mockRepository, 'update')
        .mockImplementation(async () =>
          Promise.reject(new Error('mock error')),
        );

      try {
        await service.update(mockData.userId, mockData.userNewValues);
      } catch (e) {
        expect(fnRepositoryUpdate).toHaveBeenCalledTimes(1);
        expect(fnRepositoryUpdate).toHaveBeenCalledWith(
          mockData.userId,
          mockData.userNewValues,
        );
        expect(e.message).toEqual('error on service');
      }
    });
  });

  describe('delete', () => {
    it('success', async () => {
      const fnRepositoryGetById = jest
        .spyOn(mockRepository, 'getById')
        .mockImplementation(async () => undefined);

      const fnRepositoryDelete = jest
        .spyOn(mockRepository, 'delete')
        .mockImplementation(async () => undefined);

      await service.delete(mockData.userId);

      expect(fnRepositoryGetById).toHaveBeenCalledTimes(1);
      expect(fnRepositoryGetById).toHaveBeenCalledWith(mockData.userId);
      expect(fnRepositoryDelete).toHaveBeenCalledTimes(1);
      expect(fnRepositoryDelete).toHaveBeenCalledWith(mockData.userId);
    });

    it('error on repository getById', async () => {
      const fnRepositoryGetById = jest
        .spyOn(mockRepository, 'getById')
        .mockImplementation(async () =>
          Promise.reject(new Error('mock error')),
        );

      try {
        await service.delete(mockData.userId);
      } catch (e) {
        expect(fnRepositoryGetById).toHaveBeenCalledTimes(1);
        expect(fnRepositoryGetById).toHaveBeenCalledWith(mockData.userId);
        expect(e.message).toEqual('error on service');
      }
    });

    it('error on repository delete', async () => {
      const fnRepositoryGetById = jest
        .spyOn(mockRepository, 'getById')
        .mockImplementation(async () => undefined);

      const fnRepositoryDelete = jest
        .spyOn(mockRepository, 'delete')
        .mockImplementation(async () =>
          Promise.reject(new Error('mock error')),
        );

      try {
        await service.delete(mockData.userId);
      } catch (e) {
        expect(fnRepositoryGetById).toHaveBeenCalledTimes(1);
        expect(fnRepositoryGetById).toHaveBeenCalledWith(mockData.userId);
        expect(fnRepositoryDelete).toHaveBeenCalledTimes(1);
        expect(fnRepositoryDelete).toHaveBeenCalledWith(mockData.userId);
        expect(e.message).toEqual('error on service');
      }
    });
  });
});
