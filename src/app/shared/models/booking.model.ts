import { Service } from './service.model';
import { Profile } from './profile.model';

export interface Booking {
  id: number;
  service: Service;
  customer: Profile;
  scheduledTime: string;
  details: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  acceptedAt?: string | null;
  completedAt?: string | null;
  cancelledAt?: string | null;
}
