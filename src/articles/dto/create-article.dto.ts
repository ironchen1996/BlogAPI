import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class CreateArticleDto {
  @IsNotEmpty({ message: '標題不能為空！' })
  @IsString({ message: '標題不是字符串！' })
  @Length(5, 30, { message: '標題不能少於8字節或大於30字節！' })
  title: string;

  @IsNotEmpty({ message: '內容不能為空！' })
  @IsString({ message: '內容不是字符串！' })
  @MinLength(50, { message: '內容不能少於50字節' })
  content: string;

  coverUrl: string;

  @IsNotEmpty({ message: '分類不能為空！' })
  @IsNumber()
  categoryId: number;

  @IsNotEmpty({ message: '標籤不能為空！' })
  @IsString({ each: true, message: '標籤必須為字符串！' })
  tags: Array<string>;

  @IsEnum(['publishing', 'draft', 'deletion'], { message: '狀態值無效' })
  status: string;

  @IsNumber()
  isRecommend: number;

  @IsNumber()
  isTop: number;
}
