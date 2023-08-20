import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { GetArticleDto } from './dto/get-article.dto';
import { Article } from './entities/article.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity';
import { Tag } from '../tags/entities/tag.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article) private articleRepository: Repository<Article>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Tag) private tagRepository: Repository<Tag>,
  ) {}

  async create(user: User, createArticleDto: CreateArticleDto) {
    const { title, content, tags, categoryId, status, isRecommend, isTop } =
      createArticleDto;

    const articleTitle = await this.articleRepository.findOne({
      where: { title },
    });

    if (articleTitle) {
      throw new HttpException('文章標題已存在', HttpStatus.CONFLICT);
    }

    const articleContent = await this.articleRepository.findOne({
      where: { content },
    });

    if (articleContent) {
      throw new HttpException('文章內容已存在', HttpStatus.CONFLICT);
    }

    const articleCategory = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });

    const existingTags = await this.tagRepository.find({
      where: { name: In(tags) },
    });
    const existingTagsName = existingTags.map((tags) => tags.name);
    const missingTagNames = tags.filter(
      (name) => !existingTagsName.includes(name),
    );
    const newTags = missingTagNames.map((name) =>
      this.tagRepository.create({ name }),
    );
    const createTags = await this.tagRepository.save(newTags);
    const allTags = [...existingTags, ...createTags];

    const article = new Article();
    article.title = title;
    article.content = content;
    article.category = articleCategory;
    article.tags = allTags;
    article.author = user;
    article.status = status;
    article.isRecommend = isRecommend;
    article.isTop = isTop;
    const currentTime = new Date();
    if (status === 'publishing') {
      article.publishTime = currentTime;
    }

    const newArticle = await this.articleRepository.create(article);
    return await this.articleRepository.save(newArticle);
  }

  async findAll(getArticleDto: GetArticleDto) {
    const {
      keyword,
      limit,
      page,
      fazzyTitle,
      categoryId,
      tags,
      status,
      create_time,
    } = getArticleDto;
    const take = limit || 5;
    const skip = ((page || 1) - 1) * take;

    const queryBuilder = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.tags', 'tags');

    if (fazzyTitle) {
      console.log('Searching by title:', fazzyTitle);
      queryBuilder.where('article.title LIKE :fazzyTitle', {
        fazzyTitle: `%${fazzyTitle}%`,
      });
    }

    if (categoryId) {
      queryBuilder.andWhere('category.id = :categoryId', { categoryId });
    }

    if (tags && tags.length > 0) {
      queryBuilder.andWhere('tags.name IN (:...tagNames)', {
        tagNames: tags,
      });
    }

    if (status) {
      queryBuilder.andWhere('article.status = :status', { status });
    }

    if (keyword) {
      queryBuilder.andWhere(
        '(article.title LIKE :keyword OR article.content LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    if (create_time && create_time.length === 2) {
      const startDate = create_time[0];
      const endDate = create_time[1];

      // Adjust the query to search for articles within the time range
      queryBuilder.andWhere(
        'article.create_time >= :startDate AND article.create_time <= :endDate',
        { startDate, endDate },
      );
    }

    const [data, total] = await queryBuilder
      .take(take)
      .skip(skip)
      .getManyAndCount();

    for (const article of data) {
      const articleTags = await this.tagRepository
        .createQueryBuilder('tag')
        .leftJoin('tag.articles', 'article')
        .where('article.id = :id', { id: article.id })
        .getMany();

      article.tags = articleTags;
    }

    return { data, total };
  }

  async increaseCount(id: number) {
    const article = await this.articleRepository.findOne({ where: { id } });

    if (!article) {
      return new HttpException('文章不存在', HttpStatus.BAD_REQUEST);
    }

    article.count = article.count + 1;

    return await this.articleRepository.save(article);
  }

  async findOne(id: number) {
    const article = await this.articleRepository
      .createQueryBuilder('article')
      .select([
        'article.id',
        'article.title',
        'article.content',
        'article.isRecommend',
        'article.isTop',
        'article.publishTime',
        'article.count',
        'article.create_time',
        'article.update_time',
      ])
      .where('article.id = :id', { id })
      .leftJoinAndSelect('article.category', 'category')
      .addSelect(['category.id', 'category.name'])
      .leftJoinAndSelect('article.tags', 'tags')
      .addSelect(['tags.id', 'tags.name'])
      .getOne();

    if (!article) {
      return new HttpException('文章不存在', HttpStatus.BAD_REQUEST);
    } else {
      this.increaseCount(id);
    }

    return article;
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    const { title, content, tags, categoryId, status, isRecommend, isTop } =
      updateArticleDto;

    const article = await this.articleRepository.findOne({ where: { id } });

    if (!article) {
      throw new HttpException('文章不存在', HttpStatus.NOT_FOUND);
    }

    if (title !== undefined) {
      const articleTitle = await this.articleRepository.findOne({
        where: { title },
      });
      if (articleTitle && articleTitle.id !== id) {
        throw new HttpException('文章標題已存在', HttpStatus.BAD_REQUEST);
      }
    }

    if (content !== undefined) {
      const articleContent = await this.articleRepository.findOne({
        where: { content },
      });
      if (articleContent && articleContent.id !== id) {
        throw new HttpException('文章内容已存在', HttpStatus.BAD_REQUEST);
      }
    }

    if (categoryId !== undefined) {
      const articleCategory = await this.categoryRepository.findOne({
        where: { id: categoryId },
      });
      article.category = articleCategory;
    }

    if (tags !== undefined) {
      const existingTags = await this.tagRepository.find({
        where: { name: In(tags) },
      });
      const existingTagsName = existingTags.map((tags) => tags.name);
      const missingTagNames = tags.filter(
        (name) => !existingTagsName.includes(name),
      );
      const newTags = missingTagNames.map((name) =>
        this.tagRepository.create({ name }),
      );
      const createTags = await this.tagRepository.save(newTags);
      const allTags = [...existingTags, ...createTags];
      article.tags = allTags;
    }

    if (title !== undefined) {
      article.title = title;
    }
    if (content !== undefined) {
      article.content = content;
    }
    if (status !== undefined) {
      article.status = status;
    }
    if (status === 'publish') {
      article.publishTime = new Date();
    } else {
      article.publishTime = null;
    }
    if (isRecommend !== undefined) {
      article.isRecommend = isRecommend;
    }
    if (isTop !== undefined) {
      article.isTop = isTop;
    }

    article.update_time = new Date();

    return await this.articleRepository.save(article);
  }

  async updateStatusBulk(articleIds: number[], status: string) {
    return await this.articleRepository
      .createQueryBuilder()
      .update(Article)
      .set({ status })
      .whereInIds(articleIds)
      .execute();
  }

  async remove(id: number) {
    return await this.articleRepository.delete(id);
  }

  async removeArticles(articleIds: number[]) {
    return await this.articleRepository
      .createQueryBuilder()
      .delete()
      .whereInIds(articleIds)
      .execute();
  }
  Catch(error) {
    console.error('Error deleting articles: ', error);
    return { success: false, message: 'Error deleting articles' };
  }
}
