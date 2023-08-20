import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMenuDto {
  @IsString({ message: '名稱必須是字符串' })
  @IsNotEmpty({ message: '名稱不能為空' })
  name: string;

  @IsString({ message: '名稱必須是字符串' })
  @IsNotEmpty({ message: '路徑不能為空' })
  path: string;

  @IsNumber()
  @IsOptional()
  order: number;

  @IsString({ message: 'acl必須是字符串' })
  @IsOptional()
  acl: string;
}
