import { ApiProperty } from '@nestjs/swagger';

export class CreateUserSwaggerInput {
  @ApiProperty({
    example: 'myname',
  })
  userName: string;

  @ApiProperty({
    example: 'test@test.com',
  })
  email: string;

  @ApiProperty({
    example: '123456',
  })
  password: string;
}

export class UpdateUserSwaggerInput {
  @ApiProperty({
    example: 'myname',
  })
  userName?: string;

  @ApiProperty({
    example: 'test@test.com',
  })
  email?: string;

  @ApiProperty({
    example: '123456',
  })
  password?: string;
}
