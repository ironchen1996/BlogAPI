import { Injectable } from '@nestjs/common';
import { GetUserDto } from './dto/get-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { conditionUtils } from 'src/utils/db.helper';
import * as argon2 from 'argon2';
import { Roles } from '../roles/entities/roles.entity';
import { Logs } from '../logs/entities/log.entity';
import { Profile } from './entities/profile.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Logs)
    private readonly logsRepository: Repository<Logs>,
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  async findAll(getUserDto: GetUserDto) {
    const { limit, page, username, gender, role } = getUserDto;
    const take = limit || 10;
    const skip = ((page || 1) - 1) * take;
    //　高级优化
    const obj = {
      'user.username': username,
      'profile.gender': gender,
      'roles.id': role,
    };
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.roles', 'roles');
    const newQuery = conditionUtils<User>(queryBuilder, obj);
    return newQuery.take(take).skip(skip).getMany();
  }

  async find(username: string) {
    return await this.userRepository.findOne({
      where: { username },
      relations: ['roles', 'profile', 'roles.menus'],
    });
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['roles', 'profile', 'roles.menus'],
    });
  }

  async create(user: Partial<User>) {
    if (!user.roles) {
      const role = await this.rolesRepository.findOne({ where: { id: 3 } });
      user.roles = [role];
    }
    if (user.roles instanceof Array && typeof user.roles[0] === 'number') {
      user.roles = await this.rolesRepository.find({
        where: {
          id: In(user.roles),
        },
      });
    }

    user.profile = new Profile();
    const userTmp = await this.userRepository.create(user);
    userTmp.password = await argon2.hash(userTmp.password);
    const res = this.userRepository.save(userTmp);
    return res;
  }

  async update(id: any, user: Partial<User>) {
    const userTemp = await this.findOne(parseInt(id));
    const newUser = this.userRepository.merge(userTemp, user);
    newUser.password = await argon2.hash(newUser.password);
    // 聯合模型更新，需要使用save方法或者queryBuilder
    return this.userRepository.save(newUser);

    // 下面的update方法，只適用於單模型的更新，不適合有關系模型更新．
    // return this.userRepository.update(id, user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return this.userRepository.remove(user);
  }

  async updateProfile(id: any, profile: Partial<Profile>) {
    const user = await this.findOne(parseInt(id));
    const newProfile = this.profileRepository.merge(user.profile, profile);
    return this.profileRepository.save(newProfile);
  }

  async findUserLogs(id: number) {
    const user = await this.findOne(id);
    return this.logsRepository.find({
      where: {
        user: user.logs,
      },
      // relations: {
      //   user: true,
      // },
    });
  }

  findLogsByGroup(id: number) {
    return (
      this.logsRepository
        .createQueryBuilder('logs')
        .select('logs.result', 'result')
        .addSelect('COUNT("logs.result")', 'count')
        .leftJoinAndSelect('logs.user', 'user')
        .where('user.id = :id', { id })
        .groupBy('logs.result')
        .orderBy('count', 'DESC')
        .addOrderBy('result', 'DESC')
        .offset(2)
        .limit(3)
        // .orderBy('result', 'DESC')
        .getRawMany()
    );
  }
}
