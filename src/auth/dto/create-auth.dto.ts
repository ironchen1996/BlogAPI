import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 20, {
    // $value:　當前用戶傳入的值
    //$property:當前屬性名
    //$target:當前類
    //$constraint1:最小長度
    message: `用戶名長度必須在$constraint1到$constraint2之間，當前傳遞的值是：$value`,
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 24, {
    message: `密碼長度必須在$constraint1到$constraint2之間，當前傳遞的值是：$value`,
  })
  password: string;
}
