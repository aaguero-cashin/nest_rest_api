import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import Transformers from '../transfomer/user.transformer';
import { UUID } from 'crypto';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: UUID;

  @ApiProperty()
  @Column({ name: 'first_name' })
  userName: string;

  @ApiProperty()
  @Column({ name: 'email' })
  email: string;

  @ApiProperty()
  @Column({ transformer: new Transformers.Password(), name: 'password' })
  password: string;
}
