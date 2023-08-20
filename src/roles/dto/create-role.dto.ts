import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString({ message: '角色名稱必須是字符串' })
  @IsNotEmpty({ message: '角色名稱不能為空' })
  name: string;
}
