import { Provider } from './provider.model';
import { Category } from './category.model';

export interface Service {
  id: number;
  provider: Provider;
  category: Category;
  title: string;
  description: string;
  price: string;
  duration: string;
  is_active: boolean;
  created_at: string;
  approval: string;
  image?: string;
}
