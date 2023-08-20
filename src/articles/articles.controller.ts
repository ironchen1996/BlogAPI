import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  ParseArrayPipe,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { GetArticleDto } from './dto/get-article.dto';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enum/roles.enum';
import { JwtGuard } from '../guards/jwt.guard';
import { RoleGuard } from '../guards/role.guard';
import { Article } from './entities/article.entity';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(Role.Admin)
  @Post()
  create(@Body() createArticleDto: CreateArticleDto, @Req() req) {
    return this.articlesService.create(req.user?.userId, createArticleDto);
  }

  @Get()
  findAll(@Query() getArticleDto: GetArticleDto): any {
    return this.articlesService.findAll(getArticleDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(+id);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(Role.Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.update(+id, updateArticleDto);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(Role.Admin)
  @Post('status')
  updateStatusBulk(@Body() body: { articleIds: number[]; status: string }) {
    const { articleIds, status } = body;
    return this.articlesService.updateStatusBulk(articleIds, status);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articlesService.remove(+id);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(Role.Admin)
  @Post('delete')
  removeArticles(@Body() body: { ids: number[] }) {
    const { ids } = body;
    return this.articlesService.removeArticles(ids);
  }
}
