export interface LoginUser {
  email: string;
  password: string;
}

export interface RegisterUser {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

export interface AccessTokens {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshToken {
  refreshToken: string;
}

