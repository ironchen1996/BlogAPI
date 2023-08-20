import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OptionsService } from './siteOptions.service';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enum/roles.enum';

@Controller('options')
export class OptionsController {
  constructor(private readonly optionsService: OptionsService) {}

  // @UseGuards(JwtGuard, RoleGuard)
  // @Roles(Role.Admin)
  // @Post()
  // create(@Body() createOptionDto: CreateOptionDto) {
  //   return this.optionsService.create(createOptionDto);
  // }

  // @Get()
  // findAll() {
  //   return this.optionsService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.optionsService.findOne(+id);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(Role.Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOptionDto: UpdateOptionDto) {
    return this.optionsService.update(+id, updateOptionDto);
  }

  // @UseGuards(JwtGuard, RoleGuard)
  // @Roles(Role.Admin)
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.optionsService.remove(+id);
  // }
}
