import { User } from './user.model';

export interface Profile {
  id: number;
  user: User;
  avatar?: string;
  phone?: string;
  location?: string;
  wallet: number;
  is_provider: boolean;
}
