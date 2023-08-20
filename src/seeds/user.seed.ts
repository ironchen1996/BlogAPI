import { DataSource } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Roles } from '../roles/entities/roles.entity';
import { Profile } from '../user/entities/profile.entity';
import * as argon2 from 'argon2';

export default async function createDefaultUser(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  const rolesRepository = dataSource.getRepository(Roles);
  const profileRepository = dataSource.getRepository(Profile);
  const adminRole = await rolesRepository.findOne({ where: { name: 'admin' } });
  const adminProfile = await profileRepository.findOne({ where: { id: 1 } });
  const password = await argon2.hash('123456');
  const user = {
    username: 'admin',
    password: password,
    description: '系统管理员',
    roles: [adminRole, adminProfile],
  };
  const foundUser = await userRepository.findOne({
    where: { username: 'admin' },
  });
  if (!foundUser) {
    await userRepository.save(userRepository.create(user));
  }
}
