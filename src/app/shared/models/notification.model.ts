import {Booking} from 'app/shared/models/booking.model';
import {Profile} from 'app/shared/models/profile.model';

export interface Notification {
  id: number;
  recipient: Profile;
  message: string;
  booking?: Booking;
  url: string | null;
  read: boolean;
  created_at: string;
  action_required?: boolean;
}

