import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import Transformers from '../transfomer/user.transformer';
import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { UUID } from 'crypto';

@ArgsType()
@ObjectType()
@Entity('users')
export class UserEntity {
  @Field(() => String, { nullable: true })
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: UUID;

  @Field(() => String)
  @ApiProperty()
  @Column({ name: 'first_name' })
  userName: string;

  @Field(() => String)
  @ApiProperty()
  @Column({ name: 'email' })
  email: string;

  @Field(() => String)
  @ApiProperty()
  @Column({ transformer: new Transformers.Password(), name: 'password' })
  password: string;
}
