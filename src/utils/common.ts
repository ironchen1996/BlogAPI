import { Logs } from '../logs/entities/log.entity';
import { Menus } from '../menus/entities/menu.entity';
import { Roles } from '../roles/entities/roles.entity';
import { User } from '../user/entities/user.entity';

export const getEntities = (path: string) => {
  // /user -> User, /logs -> Logs, /roles -> Roles, /menus -> Menus, /auth -> 'Auth'
  const map = {
    '/users': User,
    '/logs': Logs,
    '/roles': Roles,
    '/menus': Menus,
    '/auth': 'Auth',
  };

  for (let i = 0; i < Object.keys(map).length; i++) {
    const key = Object.keys(map)[i];
    if (path.startsWith(key)) {
      return map[key];
    }
  }
};
