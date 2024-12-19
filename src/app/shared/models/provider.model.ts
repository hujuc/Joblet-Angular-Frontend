import { Profile } from './profile.model';

export interface Provider {
  id: number;
  profile: Profile;
  about: string;
  contact_email: string;
  linkedin: string;
  twitter: string;
  facebook: string;
  average_rating?: number;
  total_reviews?: number;
}
