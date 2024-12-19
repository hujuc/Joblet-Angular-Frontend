import { Booking } from './booking.model';

export interface Chat {
  id: number;
  booking: Booking;
  created_at: string;
  is_active: boolean;
}
