import { DataSource } from 'typeorm';
import { Profile } from '../user/entities/profile.entity';

export default async function createDefaultProfile(dataSource: DataSource) {
  const profileRepository = dataSource.getRepository(Profile);
  const profile = {
    nickname: 'Admin',
  };

  const foundProfileByNickname = await profileRepository.findOne({
    where: { nickname: 'Admin' },
  });

  const foundProfileById = await profileRepository.findOne({
    where: { id: 1 },
  });

  if (!foundProfileByNickname && !foundProfileById) {
    await profileRepository.save(profileRepository.create(profile));
  }
}
