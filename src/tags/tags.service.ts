import { ConflictException, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { GetTagDto } from './dto/get-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagsService {
  constructor(@InjectRepository(Tag) private tagRepository: Repository<Tag>) {}

  async create(createTagDto: CreateTagDto) {
    const { name } = createTagDto;
    const tagTemp = await this.tagRepository.findOne({ where: { name } });
    if (tagTemp) {
      throw new ConflictException('标签已存在');
    }

    const tag = await this.tagRepository.create(createTagDto);
    return this.tagRepository.save(tag);
  }

  async findAll(getTagDto: GetTagDto) {
    const { keyword, page, limit } = getTagDto;
    const take = limit || 5;
    const skip = ((page || 1) - 1) * take;

    const queryBuilder = await this.tagRepository.createQueryBuilder('tag');

    if (keyword) {
      queryBuilder.where('tag.name LIKE :name', { name: `%${keyword}%` });
    }

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return { data, total };
  }

  async findAllTags(getTagDto: GetTagDto) {
    const { keyword } = getTagDto;
    const queryBuilder = this.tagRepository.createQueryBuilder('tag');
    if (keyword) {
      queryBuilder.where('tag.name LIKE :name', { name: `%${keyword}%` });
    }

    const tags = await queryBuilder.getMany();
    return tags;
  }

  async findTag(getTagDto: GetTagDto) {
    const { keyword } = getTagDto;
    return await this.tagRepository.findOne({ where: { name: keyword } });
  }

  async findOne(id: number) {
    return await this.tagRepository.findOne({ where: { id } });
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    const { name } = updateTagDto;
    const existingTag = await this.tagRepository.findOne({ where: { name } });
    if (existingTag && existingTag.id !== id) {
      throw new ConflictException('标签已存在');
    }

    const tag = await this.findOne(id);

    const newTag = await this.tagRepository.merge(tag, updateTagDto);
    return this.tagRepository.save(newTag);
  }

  remove(id: number) {
    return this.tagRepository.delete(id);
  }
}
