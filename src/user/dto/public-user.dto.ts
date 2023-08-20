import { Exclude, Expose } from 'class-transformer';
import { Logs } from '../../logs/entities/log.entity';
import { Roles } from '../../roles/entities/roles.entity';
import { Profile } from '../entities/profile.entity';

export class PublicUserDto {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Exclude()
  password: string;

  // typescript -> 数据库 关联关系 Mapping
  @Expose()
  logs: Logs[];

  @Expose()
  roles: Roles[];

  @Expose()
  profile: Profile;

  // @AfterInsert()
  // afterInsert() {
  //   console.log('afterInsert', this.id, this.username);
  // }

  // @AfterRemove()
  // afterRemove() {
  //   console.log('afterRemove');
  // }
}
