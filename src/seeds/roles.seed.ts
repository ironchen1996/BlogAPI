import { DataSource } from 'typeorm';
import { Roles } from '../roles/entities/roles.entity';

export default async function createDefaultRoles(dataSource: DataSource) {
  const roleRepository = dataSource.getRepository(Roles);
  const roles = [
    { name: 'admin', description: '系统管理员' },
    { name: 'author', description: '作者' },
    { name: 'user', description: '普通用户' },
  ];
  for (const r of roles) {
    const foundRole = await roleRepository.findOne({ where: { name: r.name } });
    if (!foundRole) {
      await roleRepository.save(roleRepository.create(r));
    }
  }
}
