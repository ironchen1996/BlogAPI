import {
  Controller,
  Post,
  Body,
  UseFilters,
  UseInterceptors,
  ClassSerializerInterceptor,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { TypeormFilter } from '../filters/typeorm.filter';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enum/roles.enum';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { RoleGuard } from 'src/guards/role.guard';
// import { SerializeInterceptor } from '../interceptors/serialize.interceptor';

@Controller('auth')
@UseFilters(new TypeormFilter())
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @UseInterceptors(ClassSerializerInterceptor)
  async login(@Body() createAuthDto: CreateAuthDto) {
    const { username, password } = createAuthDto;
    const token = await this.authService.login(username, password);
    return {
      access_token: token,
    };
  }

  @Post('/register')
  register(@Body() createAuthDto: CreateAuthDto) {
    const { username, password } = createAuthDto;
    return this.authService.register(username, password);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtGuard, RoleGuard)
  @Patch('/update-password')
  async updatePassword(@Body() updateAuthDto: UpdateAuthDto) {
    // const { username, oldPassword, newPassword } = updateAuthDto;
    return await this.authService.updatePassword(updateAuthDto);
  }
}
