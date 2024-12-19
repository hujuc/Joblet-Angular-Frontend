import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from 'app/shared/services/auth.service';
import { ProfileService } from 'app/shared/services/profile.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProviderGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private profileService: ProfileService
  ) {}

  async canActivate(): Promise<boolean | UrlTree> {
    const isAuthenticated = !!this.authService.getAccessToken();

    try {
      const profile = await firstValueFrom(this.authService.getMyProfile());
      const provider = profile.is_provider;

      console.log('isAuthenticated: ', isAuthenticated);
      console.log('provider: ', provider);

      if (isAuthenticated && provider === true) {
        console.log('Provider access granted');
        return true;
      } else {
        console.log('Access denied: Not a provider');
        return this.router.createUrlTree(['/unauthorized']);
      }
    } catch (error) {
      console.error('Error checking provider status:', error);
      return this.router.createUrlTree(['/unauthorized']);
    }
  }
}
