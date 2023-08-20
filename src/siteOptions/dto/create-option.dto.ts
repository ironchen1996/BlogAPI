import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOptionDto {
  @IsNotEmpty({ message: 'Logo不能为空' })
  @IsString({ message: 'Logo必须为字符串' })
  logo: string;

  @IsNotEmpty({ message: 'Logo描述不能为空' })
  @IsString({ message: 'Logo描述必须为字符串' })
  logoDiscribe: string;

  @IsNotEmpty({ message: '底部信息不能为空' })
  @IsString({ message: '底部信息必须为字符串' })
  footerInfo: string;
}
