import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { Role } from 'src/enum/roles.enum';
import { UserService } from '../user/user.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector, private userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    //getAllAndMerge -> 合併   getAllAndOverride -> 讀取路由上的metadate
    const requireRoles = this.reflector.getAllAndMerge<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requireRoles) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    const user = await this.userService.find(req.user.username);
    const roleIds = user.roles.map((o) => o.id);
    return requireRoles.some((role) => roleIds.includes(role));
  }
}
