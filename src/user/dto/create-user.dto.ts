import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Roles } from '../../roles/entities/roles.entity';
import { Profile } from '../entities/profile.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 20)
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 24)
  password: string;

  roles?: Roles[] | number[];

  profile: Profile;
}
