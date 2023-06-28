import {
  HttpStatus,
  Controller,
  Post,
  Body,
  Res,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { CreateUserInput, UpdateUserInput } from '../inputs/user.inputs';
import { UserService } from '../service/user.service';
import { Response } from 'express';
import { UUID } from 'crypto';
import { ApiTags, ApiBody, ApiResponse, ApiParam } from '@nestjs/swagger';
import {
  CreateUserSwaggerInput,
  UpdateUserSwaggerInput,
} from '../swaggerInput/user.swagger.inut';
import { UserEntity } from '../entity/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly _service: UserService) {}

  @Post()
  @ApiTags('create user')
  @ApiBody({ type: CreateUserSwaggerInput })
  @ApiResponse({ type: UserEntity, status: HttpStatus.CREATED })
  async create(@Body() data: CreateUserInput, @Res() res: Response) {
    try {
      const response = await this._service.create(data);

      return res.status(HttpStatus.CREATED).json(response);
    } catch (e) {
      console.log(e);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
    }
  }

  @Get()
  @ApiTags('get all user')
  @ApiResponse({ type: [UserEntity], status: HttpStatus.OK })
  async getAll(@Res() res: Response) {
    try {
      const response = await this._service.getAll();

      return res.status(HttpStatus.OK).json(response);
    } catch (e) {
      console.log(e);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
    }
  }

  @Get(':id')
  @ApiTags('get user by id')
  @ApiParam({ name: 'id', example: '85ffcb9c-1468-11ee-be56-0242ac120002' })
  @ApiResponse({ type: UserEntity, status: HttpStatus.OK })
  async getById(@Param('id') id: UUID, @Res() res: Response) {
    try {
      const response = await this._service.getById(id);

      return res.status(HttpStatus.OK).json(response);
    } catch (e) {
      switch (e.message) {
        case 'no content':
          return res.status(HttpStatus.NO_CONTENT).send();
        default:
          console.log(e);
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
      }
    }
  }

  @Put(':id')
  @ApiTags('update user')
  @ApiParam({ name: 'id', example: '85ffcb9c-1468-11ee-be56-0242ac120002' })
  @ApiBody({ type: UpdateUserSwaggerInput })
  @ApiResponse({ status: HttpStatus.OK })
  async update(
    @Body() data: UpdateUserInput,
    @Param('id') id: UUID,
    @Res() res: Response,
  ) {
    try {
      await this._service.update(id, data);

      return res.status(HttpStatus.OK).json({ message: 'user was updated' });
    } catch (e) {
      switch (e.message) {
        case 'no content':
          return res.status(HttpStatus.NO_CONTENT).send();
        default:
          console.log(e);
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
      }
    }
  }

  @Delete(':id')
  @ApiTags('delete user')
  @ApiParam({ name: 'id', example: '85ffcb9c-1468-11ee-be56-0242ac120002' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  async delete(@Param('id') id: UUID, @Res() res: Response) {
    try {
      await this._service.delete(id);

      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (e) {
      console.log(e);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
    }
  }
}
