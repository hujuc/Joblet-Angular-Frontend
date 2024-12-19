import { Provider } from './provider.model';
import { Profile } from './profile.model';

export interface Review {
  id: number;
  provider: Provider;
  reviewer: Profile;
  rating: number;
  comment?: string;
  created_at: string;
}
