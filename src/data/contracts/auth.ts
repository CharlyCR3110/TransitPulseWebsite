import type { UserProfileDto } from './users';

export interface RegisterInput {
  email: string;
  password: string;
  displayName: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthToken {
  accessToken: string;
  expiresAt: string;
}

export interface AuthProvider {
  register(input: RegisterInput): Promise<UserProfileDto>;
  login(input: LoginInput): Promise<AuthToken>;
}
