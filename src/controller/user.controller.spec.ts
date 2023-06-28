import { Test, TestingModule } from '@nestjs/testing';
import { UserEntity } from '../entity/user.entity';
import { UserController } from './user.controller';
import { UserService } from '../service/user.service';
import mockData from './mockData';
import { HttpStatus } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  const mockResponse = (): any => {
    const res: any = {};
    res.send = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);

    return res;
  };

  const mockService = {
    create: jest.fn(async (): Promise<UserEntity | undefined> => null),
    getAll: jest.fn(async (): Promise<UserEntity[] | undefined> => null),
    getById: jest.fn(async (): Promise<UserEntity | undefined> => null),
    update: jest.fn(async () => null),
    delete: jest.fn(async () => null),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('success', async () => {
      const fnServiceCreate = jest
        .spyOn(mockService, 'create')
        .mockImplementation(async () => Promise.resolve(mockData.userCreated));

      const res = mockResponse();

      await controller.create(mockData.userToCreate, res);

      expect(fnServiceCreate).toHaveBeenCalledTimes(1);
      expect(fnServiceCreate).toHaveBeenCalledWith(mockData.userToCreate);
      expect(res.status).toBeCalledWith(HttpStatus.CREATED);
      expect(res.json).toBeCalledWith(mockData.userCreated);
    });

    it('error in service create', async () => {
      const fnServiceCreate = jest
        .spyOn(mockService, 'create')
        .mockImplementation(async () => Promise.reject(new Error('mock eror')));

      const res = mockResponse();

      await controller.create(mockData.userToCreate, res);

      expect(fnServiceCreate).toHaveBeenCalledTimes(1);
      expect(fnServiceCreate).toHaveBeenCalledWith(mockData.userToCreate);
      expect(res.status).toBeCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.send).toBeCalledWith();
    });
  });

  describe('getAll', () => {
    it('success', async () => {
      const fnServiceGetAll = jest
        .spyOn(mockService, 'getAll')
        .mockImplementation(async () =>
          Promise.resolve([mockData.userCreated]),
        );

      const res = mockResponse();

      await controller.getAll(res);

      expect(fnServiceGetAll).toHaveBeenCalledTimes(1);
      expect(res.status).toBeCalledWith(HttpStatus.OK);
      expect(res.json).toBeCalledWith([mockData.userCreated]);
    });

    it('error in service getAll', async () => {
      const fnServiceGetAll = jest
        .spyOn(mockService, 'getAll')
        .mockImplementation(async () => Promise.reject(new Error('mock eror')));

      const res = mockResponse();

      await controller.getAll(res);

      expect(fnServiceGetAll).toHaveBeenCalledTimes(1);
      expect(res.status).toBeCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.send).toBeCalledWith();
    });
  });

  describe('getById', () => {
    it('success', async () => {
      const fnServiceGetById = jest
        .spyOn(mockService, 'getById')
        .mockImplementation(async () => Promise.resolve(mockData.userCreated));

      const res = mockResponse();

      await controller.getById(mockData.userId, res);

      expect(fnServiceGetById).toHaveBeenCalledTimes(1);
      expect(fnServiceGetById).toHaveBeenCalledWith(mockData.userId);
      expect(res.status).toBeCalledWith(HttpStatus.OK);
      expect(res.json).toBeCalledWith(mockData.userCreated);
    });

    it('error in service getById, no content', async () => {
      const fnServiceGetById = jest
        .spyOn(mockService, 'getById')
        .mockImplementation(async () =>
          Promise.reject(new Error('no content')),
        );

      const res = mockResponse();

      await controller.getById(mockData.userId, res);

      expect(fnServiceGetById).toHaveBeenCalledTimes(1);
      expect(fnServiceGetById).toHaveBeenCalledWith(mockData.userId);
      expect(res.status).toBeCalledWith(HttpStatus.NO_CONTENT);
      expect(res.send).toBeCalledWith();
    });

    it('error in service getById, generic error', async () => {
      const fnServiceGetById = jest
        .spyOn(mockService, 'getById')
        .mockImplementation(async () =>
          Promise.reject(new Error('mock error')),
        );

      const res = mockResponse();

      await controller.getById(mockData.userId, res);

      expect(fnServiceGetById).toHaveBeenCalledTimes(1);
      expect(fnServiceGetById).toHaveBeenCalledWith(mockData.userId);
      expect(res.status).toBeCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.send).toBeCalledWith();
    });
  });

  describe('update', () => {
    it('success', async () => {
      const fnServiceUpdate = jest
        .spyOn(mockService, 'update')
        .mockImplementation(async () => Promise.resolve(1));

      const res = mockResponse();

      await controller.update(mockData.userNewValues, mockData.userId, res);

      expect(fnServiceUpdate).toHaveBeenCalledTimes(1);
      expect(fnServiceUpdate).toHaveBeenCalledWith(
        mockData.userId,
        mockData.userNewValues,
      );
      expect(res.status).toBeCalledWith(HttpStatus.OK);
      expect(res.json).toBeCalledWith({ message: 'user was updated' });
    });

    it('error in service update, no content', async () => {
      const fnServiceUpdate = jest
        .spyOn(mockService, 'update')
        .mockImplementation(async () =>
          Promise.reject(new Error('no content')),
        );

      const res = mockResponse();

      await controller.update(mockData.userNewValues, mockData.userId, res);

      expect(fnServiceUpdate).toHaveBeenCalledTimes(1);
      expect(fnServiceUpdate).toHaveBeenCalledWith(
        mockData.userId,
        mockData.userNewValues,
      );
      expect(res.status).toBeCalledWith(HttpStatus.NO_CONTENT);
      expect(res.send).toBeCalledWith();
    });

    it('error in service update, generic error', async () => {
      const fnServiceUpdate = jest
        .spyOn(mockService, 'update')
        .mockImplementation(async () =>
          Promise.reject(new Error('mock error')),
        );

      const res = mockResponse();

      await controller.update(mockData.userNewValues, mockData.userId, res);

      expect(fnServiceUpdate).toHaveBeenCalledTimes(1);
      expect(fnServiceUpdate).toHaveBeenCalledWith(
        mockData.userId,
        mockData.userNewValues,
      );
      expect(res.status).toBeCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.send).toBeCalledWith();
    });
  });

  describe('delete', () => {
    it('success', async () => {
      const fnServiceDelete = jest
        .spyOn(mockService, 'delete')
        .mockImplementation(async () => undefined);

      const res = mockResponse();

      await controller.delete(mockData.userId, res);

      expect(fnServiceDelete).toHaveBeenCalledTimes(1);
      expect(fnServiceDelete).toHaveBeenCalledWith(mockData.userId);
      expect(res.status).toBeCalledWith(HttpStatus.NO_CONTENT);
      expect(res.send).toBeCalledWith();
    });

    it('error in service delete', async () => {
      const fnServiceDelete = jest
        .spyOn(mockService, 'delete')
        .mockImplementation(async () => Promise.reject(new Error('mock eror')));

      const res = mockResponse();

      await controller.delete(mockData.userId, res);

      expect(fnServiceDelete).toHaveBeenCalledTimes(1);
      expect(fnServiceDelete).toHaveBeenCalledWith(mockData.userId);
      expect(res.status).toBeCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.send).toBeCalledWith();
    });
  });
});
