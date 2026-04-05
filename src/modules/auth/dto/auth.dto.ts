export class LoginRequestDto {
  email: string;
  password?: string;
}

export class LoginResponseDto {
  userId: number;
  userName: string;
  email: string;
  isAdmin: boolean;
  token: string;
}
