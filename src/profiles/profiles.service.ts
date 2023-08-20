// import { Injectable } from '@nestjs/common';
// // import { CreateProfileDto } from './dto/create-profile.dto';
// import { UpdateProfileDto } from './dto/update-profile.dto';
// import { Profile } from '../user/entities/profile.entity';
// import { Repository } from 'typeorm';
// import { InjectRepository } from '@nestjs/typeorm';

// @Injectable()
// export class ProfilesService {
//   constructor(
//     @InjectRepository(Profile) private profileRepository: Repository<Profile>,
//   ) {}

//   // async create(createProfileDto: CreateProfileDto) {
//   //   const profile = await this.profileRepository.create(createProfileDto);
//   //   return this.profileRepository.save(profile);
//   // }

//   findAll() {
//     return this.profileRepository.find();
//   }

//   findOne(id: number) {
//     return this.profileRepository.findOne({ where: { id } });
//   }

//   async update(id: number, updateProfileDto: UpdateProfileDto) {
//     const profile = await this.findOne(id);
//     const newProfile = await this.profileRepository.merge(
//       profile,
//       updateProfileDto,
//     );
//     return this.profileRepository.save(newProfile);
//   }

//   remove(id: number) {
//     return this.profileRepository.delete(id);
//   }
// }
