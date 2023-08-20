import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
// import { Gender } from '../../enum/gender.enum';

export class ProfileUserDto {
  @IsString()
  @IsNotEmpty()
  avatar: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 8)
  nickname: string;

  // @IsOptional()
  // gender: Gender;

  // @IsOptional()
  // birthday: Date;

  @IsString()
  @IsNotEmpty()
  @Length(50, 300)
  introduction: string;

  @IsString()
  @IsOptional()
  GitHub: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  discord: string;

  @IsString()
  @IsOptional()
  LinkedIn: string;
}
