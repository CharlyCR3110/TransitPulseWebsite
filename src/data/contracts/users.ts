export interface UserProfileDto {
  id: string;
  email: string;
  displayName: string;
  reputationScore: number;
  createdAt: string;
}

export interface UserStatsDto {
  trips: number;
}

export interface UsersProvider {
  me(): Promise<UserProfileDto>;
  stats(): Promise<UserStatsDto>;
}
