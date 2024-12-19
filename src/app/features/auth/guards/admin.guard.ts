import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from 'app/shared/services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    const admin = this.authService.isAdmin();
    const isAuthenticated = !!this.authService.getAccessToken();

    console.log(admin, isAuthenticated);

    if (isAuthenticated && admin) {
      console.log('Admin access granted');
      return true;
    } else {
      console.log('Access denied: Not an admin');
      return this.router.createUrlTree(['/unauthorized']);
    }
  }
}

