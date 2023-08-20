export interface GetUserDto {
  profile: string;
  page: number;
  limit?: number;
  username?: string;
  role?: number;
  gender?: number;
}
