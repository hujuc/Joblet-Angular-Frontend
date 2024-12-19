import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from 'app/shared/services/auth.service';
import { Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.isAuthenticated().pipe(
      first(),
      map((isAuthenticated: boolean) => {
        if (isAuthenticated) {
          console.log('Authenticated');
          return true;
        } else {
          console.log('Not authenticated');
          return this.router.createUrlTree(['/login']);
        }
      })
    );
  }
}
