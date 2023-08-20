import { Injectable } from '@nestjs/common';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { siteOption } from './entities/siteOption.entity';

@Injectable()
export class OptionsService {
  constructor(
    @InjectRepository(siteOption)
    private optionRepository: Repository<siteOption>,
  ) {}

  // create(createOptionDto: CreateOptionDto) {
  //   return 'This action adds a new option';
  // }

  // findAll() {
  //   return `This action returns all options`;
  // }

  async findOne(id: number) {
    return await this.optionRepository.findOne({ where: { id } });
  }

  async update(id: number, updateOptionDto: UpdateOptionDto) {
    const options = await this.findOne(id);
    const newOptions = await this.optionRepository.merge(
      options,
      updateOptionDto,
    );
    return this.optionRepository.save(newOptions);
  }

  // remove(id: number) {
  //   return `This action removes a #${id} option`;
  // }
}
