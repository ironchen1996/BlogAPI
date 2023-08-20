export interface GetArticleDto {
  keyword?: string;
  page: number;
  limit?: number;
  categoryId?: number;
  id?: number;
  title?: string;
  fazzyTitle?: string;
  content?: string;
  count?: number;
  Category?: {
    id: number;
    name: string;
  };
  tags?: {
    id: number;
    name: string;
  }[];
  isRecommend?: number;
  isTop?: number;
  status?: 'draft' | 'publish';
  publishTime?: Date;
  create_time?: [Date, Date];
  update_time?: Date;
}
