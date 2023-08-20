import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwt: JwtService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.userService.find(username);
    if (!user) {
      throw new ForbiddenException('用戶不存在，請注冊');
    }
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      throw new ForbiddenException('用戶名或者密碼錯誤');
    }

    const expiresIn = '72H';
    return await this.jwt.signAsync(
      {
        username: user.username,
        sub: user.id,
      },
      {
        expiresIn,
      },
    );
  }

  async register(username: any, password: string) {
    const user = await this.userService.find(username);
    if (user) {
      throw new ForbiddenException('用戶已存在');
    }
    const res = await this.userService.create({ username, password });
    return res;
  }

  async updatePassword(updateAuthDto: UpdateAuthDto) {
    const { username, oldPassword, newPassword } = updateAuthDto;
    const user = await this.userService.find(username);

    if (!user) {
      throw new UnauthorizedException('用戶名不存在');
    }

    const isCurrentPasswordValid = await argon2.verify(
      user.password,
      oldPassword,
    );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('当前密码不正确');
    }

    if (username) {
      user.username = username;
    }

    user.password = newPassword;

    const res = await this.userService.update(user.id, user);
    return res;
  }
}
