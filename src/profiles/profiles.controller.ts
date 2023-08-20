// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
//   UseGuards,
// } from '@nestjs/common';
// import { ProfilesService } from './profiles.service';
// // import { CreateProfileDto } from './dto/create-profile.dto';
// import { UpdateProfileDto } from './dto/update-profile.dto';
// import { JwtGuard } from '../guards/jwt.guard';
// import { RoleGuard } from '../guards/role.guard';
// import { CaslGuard } from '../guards/casl.guard';
// import { Can, Cannot } from '../decorators/casl.decorator';
// import { Action } from '../enum/action.enum';
// import { Profile } from '../user/entities/profile.entity';
// import { Roles } from '../decorators/roles.decorator';
// import { Role } from 'src/enum/roles.enum';

// @Roles(Role.User)
// @UseGuards(JwtGuard, RoleGuard, CaslGuard)
// @Controller('profiles')
// export class ProfilesController {
//   constructor(private readonly profilesService: ProfilesService) {}

//   // @Post()
//   // create(@Body() createProfileDto: CreateProfileDto) {
//   //   return this.profilesService.create(createProfileDto);
//   // }

//   @Get()
//   @Cannot(Action.Read, Profile)
//   findAll() {
//     return this.profilesService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.profilesService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
//     return this.profilesService.update(+id, updateProfileDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.profilesService.remove(+id);
//   }
// }
