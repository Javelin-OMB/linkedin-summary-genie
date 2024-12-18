export interface User {
  id: string;
  email: string;
  credits: number;
  is_admin: boolean;
  name: string | null;
  trial_start: string | null;
}

export type NewUser = Omit<User, 'id'> & {
  is_admin?: boolean;
  name?: string | null;
  trial_start?: string | null;
};