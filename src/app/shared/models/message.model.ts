import { Profile } from './profile.model';
import { Chat } from './chat.model';

export interface Message {
  id: number;
  chat: Chat;
  sender: Profile;
  recipient: Profile;
  content: string;
  timestamp: string;
  is_read: boolean;
  file?: string;
}
