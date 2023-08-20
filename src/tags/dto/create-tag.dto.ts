import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTagDto {
  @IsNotEmpty({ message: '標籤名稱不能為空！' })
  @IsString({ message: '標籤名稱不是字符串類型' })
  name: string;
}
