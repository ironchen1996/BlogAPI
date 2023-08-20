import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: '分類名稱不能為空！' })
  @IsString({ message: '分類名稱不是字符串類型' })
  name: string;
}
