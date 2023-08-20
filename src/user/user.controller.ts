import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  LoggerService,
  Query,
  UnauthorizedException,
  ParseIntPipe,
  UseGuards,
  UseFilters,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { User } from './entities/user.entity';
import { CreateUserPipe } from './pipes/create-user/create-user.pipe';
import { AdminGuard } from 'src/guards/admin.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { TypeormFilter } from '../filters/typeorm.filter';
import { Serialize } from 'src/decorators/serialize.decorator';
import { PublicUserDto } from './dto/public-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ProfileUserDto } from './dto/profile-user.dto';
import { Profile } from './entities/profile.entity';

@UseFilters(new TypeormFilter())
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    this.logger.log('UserController init');
  }

  @Serialize(PublicUserDto)
  @Get()
  @UseGuards(AdminGuard)
  @UseGuards(JwtGuard)
  findAll(@Query() getUserDto: GetUserDto): any {
    // 前端傳遞的Query參數全是String類型，需要轉換成number類型
    // this.logger.log('請求getUsers成功');
    // this.logger.warn('請求getUsers成功');
    // this.logger.error('請求getUsers成功');
    return this.userService.findAll(getUserDto);
    // return this.userService.getUsers();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch('/:id')
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ): Promise<any> {
    const getUser = await this.userService.findOne(req.user?.userId);
    const isAdmin = getUser.roles.some((role) => role.name === 'admin');
    if (id === parseInt(req.user?.userId) || isAdmin === true) {
      const user = updateUserDto as User;
      return this.userService.update(id, user);
    } else {
      throw new UnauthorizedException();
    }
  }

  @Delete('/:id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ): Promise<any> {
    const getUser = await this.userService.findOne(req.user?.userId);
    const isAdmin = getUser.roles.some((role) => role.name === 'admin');
    console.log(isAdmin);
    if (id === parseInt(req.user?.userId) || isAdmin === true) {
      return this.userService.remove(id);
    } else {
      throw new UnauthorizedException();
    }
  }

  @Patch('/profile/:id')
  async updateUserProfile(
    @Body() profileUserDto: ProfileUserDto,
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ): Promise<any> {
    const getUser = await this.userService.findOne(req.user?.userId);
    const isAdmin = getUser.roles.some((role) => role.name === 'admin');
    if (id === parseInt(req.user?.userId) || isAdmin === true) {
      const profile = profileUserDto as Profile;
      return this.userService.updateProfile(id, profile);
    } else {
      throw new UnauthorizedException();
    }
    // return this.userService.findProfile(id);
  }

  @Post()
  addUser(@Body(CreateUserPipe) createUserDto: CreateUserDto): any {
    const user = createUserDto as User;
    return this.userService.create(user);
  }

  // @Get('/logs')
  // getUserLogs(): any {
  //   return this.userService.findUserLogs(2);
  // }
}
