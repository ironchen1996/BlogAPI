import { DataSource } from 'typeorm';
import { siteOption } from 'src/siteOptions/entities/siteOption.entity';

export default async function createDefaultOption(dataSource: DataSource) {
  const optionRepository = dataSource.getRepository(siteOption);
  const siteOptions = {
    logo: '陈弘毅',
    logoDiscribe: '热爱IT的自由开发者',
    footerInfo: '自我介绍',
  };

  const foundOption = await optionRepository.findOne({ where: { id: 1 } });

  if (!foundOption) {
    await optionRepository.save(optionRepository.create(siteOptions));
  }
}
