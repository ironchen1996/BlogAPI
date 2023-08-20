import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Logs } from '../logs/entities/log.entity';
import { Roles } from '../roles/entities/roles.entity';
import { Profile } from './entities/profile.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, Logs, Roles, Profile])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
