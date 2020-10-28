export type User = {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  passwd: string;
  unallocated_funds: number;
};

export type CreateUserPayload = Omit<User, 'user_id'>;
export type BaseUser = Omit<User, 'user_id'>;
