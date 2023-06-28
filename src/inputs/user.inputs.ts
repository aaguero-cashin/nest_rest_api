export interface CreateUserInput {
  email: string;
  userName: string;
  password: string;
}

export interface UpdateUserInput {
  email?: string;
  userName?: string;
  password?: string;
}
