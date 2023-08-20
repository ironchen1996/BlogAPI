import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { GetTagDto } from './dto/get-tag.dto';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enum/roles.enum';
import { JwtGuard } from '../guards/jwt.guard';
import { RoleGuard } from '../guards/role.guard';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Roles(Role.Admin)
  @UseGuards(JwtGuard, RoleGuard)
  @Post()
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @Get()
  findAll(@Query() getTagDto: GetTagDto): any {
    return this.tagsService.findAll(getTagDto);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtGuard, RoleGuard)
  @Get('all')
  findAllTags(@Query() getTagDto: GetTagDto): any {
    return this.tagsService.findAllTags(getTagDto);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtGuard, RoleGuard)
  @Get('tag')
  findTag(@Query() getTagDto: GetTagDto) {
    return this.tagsService.findTag(getTagDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagsService.findOne(+id);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtGuard, RoleGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.update(id, updateTagDto);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtGuard, RoleGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagsService.remove(+id);
  }
}
