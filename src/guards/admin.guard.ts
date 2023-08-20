import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1.獲取請求對象
    const req = context.switchToHttp().getRequest();
    // 2.獲取請求中的用戶信息進行邏輯上的判斷　－＞　角色判斷
    const user = (await this.userService.find(req.user.username)) as User;
    console.log(user);
    if (user && user.roles.filter((o) => o.id === 1).length > 0) {
      return true;
    }
    return false;
  }
}
