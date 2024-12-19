import { Routes } from '@angular/router';
import {ProfileComponent} from './features/profile/profile.component';
import {HomeComponent} from './features/home/home.component';
import {MyOrdersComponent} from './features/myorders/myorders.component';
import {ServicesComponent} from './features/services/services.component';
import {ProvidersComponent} from './features/providers/providers.component';
import {LoginComponent} from './features/login/login.component';
import {RegisterComponent} from './features/register/register.component';
import {ServiceDetailComponent} from './features/services/service-detail/service-detail.component';
import {CategoriesComponent} from 'app/features/categories/categories.component';
import {BanusersComponent} from 'app/features/banusers/banusers.component';
import {PendingservicesComponent} from 'app/features/pendingservices/pendingservices.component';
import {BecameaproviderComponent} from 'app/features/becameaprovider/becameaprovider.component';
import {MyChatsComponent} from 'app/features/chats/my-chats/my-chats.component';
import {ChatComponent} from 'app/features/chats/chat.component';
import {AddServiceComponent} from 'app/features/myservices/add-service/add-service.component';
import {AuthGuard} from 'app/features/auth/guards/auth.guard';
import {AdminGuard} from 'app/features/auth/guards/admin.guard';
import {ProviderGuard} from 'app/features/auth/guards/provider.guard';
import {MyServicesComponent} from './features/myservices/myservices.component';
import {PendingBookingsComponent} from 'app/features/myservices/pending-bookings/pending-bookings.component';
import {InProgressBookingsComponent} from 'app/features/myservices/in-progress-bookings/in-progress-bookings.component';
import {NotificationsComponent} from 'app/features/notifications/notifications.component';
import {WalletComponent} from 'app/features/wallet/wallet.component';


export const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'profile/:username', component: ProfileComponent},
  {path: 'services', component: ServicesComponent},
  {path: 'services/:category', component: ServicesComponent},
  {path: 'myservices/:serviceId/to-approve', component: PendingBookingsComponent , canActivate: [ProviderGuard]},
  {path: 'myservices/:serviceId/in-progress', component: InProgressBookingsComponent , canActivate: [ProviderGuard]},
  {path: 'myservices', component: MyServicesComponent, canActivate: [ProviderGuard]},
  {path: 'service/:id', component: ServiceDetailComponent},
  {path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard]},
  {path: 'myorders', component: MyOrdersComponent, canActivate: [AuthGuard]},
  {path: 'mychats', component: MyChatsComponent, canActivate: [AuthGuard]},
  {path: 'chat/:id', component: ChatComponent, canActivate: [AuthGuard]},
  {path: 'providers', component: ProvidersComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'add-service', component: AddServiceComponent, canActivate: [ProviderGuard]},
  {path: 'categories', component: CategoriesComponent, canActivate: [AdminGuard]},
  {path: 'users', component: BanusersComponent, canActivate: [AdminGuard]},
  {path: 'pendingservices', component: PendingservicesComponent, canActivate: [AdminGuard]},
  {path: 'becameaprovider', component: BecameaproviderComponent, canActivate: [AuthGuard]},
  {path: 'wallet', component: WalletComponent},
  {path: '**', redirectTo: 'home'}
];
