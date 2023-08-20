import { Category } from '../../categories/entities/category.entity';
import { User } from '../../user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tag } from '../../tags/entities/tag.entity';

export enum ArticleStatus {
  Draft = 'draft',
  Publishing = 'publishing',
  Deletion = 'deletion',
}

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number; // 标记为主列，值自动生成
  // 文章标题
  @Column({ length: 50 })
  title: string;
  // markdown内容
  @Column({ type: 'mediumtext', default: null })
  content: string;
  // markdown 转 html,自动生成
  @Column({ type: 'mediumtext', default: null, name: 'content_html' })
  contentHtml: string;
  // 摘要，自动生成
  @Column({ type: 'text', default: null })
  summary: string;
  // 封面图
  @Column({ default: null, name: 'cover_url' })
  coverUrl: string;
  // 阅读量
  @Column({ type: 'int', default: 0 })
  count: number;
  // 点赞量
  @Column({ type: 'int', default: 0, name: 'like_count' })
  likeCount: number;
  // 推荐显示
  @Column({ type: 'tinyint', default: 0, name: 'is_recommend' })
  isRecommend: number;
  //文章置顶
  @Column({ type: 'tinyint', default: 0, name: 'is_top' })
  isTop: number;
  // 文章状态
  @Column({ type: 'enum', enum: ['draft', 'publishing', 'deletion'] })
  status: string;
  // 作者
  @ManyToOne(() => User, (user) => user.articles)
  @JoinColumn({ name: 'user_id' })
  author: User;

  @ManyToOne(() => Category, (category) => category.articles)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToMany(() => Tag, (tags) => tags.articles)
  @JoinTable({
    name: 'article_tag',
    joinColumns: [{ name: 'article_id' }],
    inverseJoinColumns: [{ name: 'tag_id' }],
  })
  tags: Tag[];

  @Column({ type: 'timestamp', name: 'publish_time', default: null })
  publishTime: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_time: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  update_time: Date;
}
