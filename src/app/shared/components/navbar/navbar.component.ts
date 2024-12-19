import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'app/shared/services/auth.service';
import { Category } from 'app/shared/models/category.model';
import { Profile } from 'app/shared/models/profile.model';
import { NgForOf, NgIf, SlicePipe, UpperCasePipe } from '@angular/common';
import { CategoryService } from 'app/shared/services/category.service';
import { ProfileService } from 'app/shared/services/profile.service';
import { NotificationService } from 'app/shared/services/notification.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [SlicePipe, UpperCasePipe, NgIf, NgForOf, RouterLink],
})
export class NavbarComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  isLoggedIn = false;
  isAdmin = false;
  isProvider = false;
  hideNavbar = false;
  profile: Profile | null = null;
  unreadNotificationsCount = 0;
  showProfileDropdown = false;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private categoryService: CategoryService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.handleAuthenticationChanges();
    this.handleRouteChanges();
    this.fetchCategories();
    this.fetchUnreadNotificationsCount();
  }

  // Handle authentication state changes
  private handleAuthenticationChanges(): void {
    const authSub = this.authService.getAuthStatus().subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        this.fetchUserInfoAndCheckProvider();
      } else {
        this.resetUserState();
      }
    });
    this.subscriptions.add(authSub);
  }

  // Reset user-related state on logout or unauthenticated state
  private resetUserState(): void {
    this.profile = null;
    this.isAdmin = false;
    this.isProvider = false;
  }

  // Handle hiding the navbar on specific routes
  private handleRouteChanges(): void {
    const routeSub = this.router.events.subscribe(() => {
      this.hideNavbar = this.router.url.includes('/login') || this.router.url.includes('/register');
    });
    this.subscriptions.add(routeSub);
  }

  // Fetch categories for the navbar
  private fetchCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data: Category[]) => {
        this.categories = data;
      },
      error: () => {
        console.error('Failed to fetch categories.');
      },
    });
  }

  // Fetch user info and determine provider/admin status
  private fetchUserInfoAndCheckProvider(): void {
    this.authService.getMyProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.checkProvider(this.profile);
      },
      error: () => {
        this.resetUserState();
      },
    });
  }

  private checkProvider(profile: Profile | null): void {
    if (profile) {
      this.profileService.checkProvider(profile.user.id).subscribe({
        next: (isProvider) => {
          this.isProvider = isProvider;
        },
        error: (err) => {
          console.error('Error checking provider status:', err);
          this.isProvider = false;
        },
      });
    }
  }

  // Fetch unread notification count
  private fetchUnreadNotificationsCount(): void {
    this.notificationService.getUnreadCount().subscribe({
      next: (count) => {
        this.unreadNotificationsCount = count;
      },
      error: (err) => console.error('Error fetching unread notifications count:', err),
    });
  }

  // Logout user
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Toggle profile dropdown visibility
  toggleProfileDropdown(): void {
    this.showProfileDropdown = !this.showProfileDropdown;
  }

  // Close profile dropdown
  closeProfileDropdown(): void {
    this.showProfileDropdown = false;
  }

  // Clean up subscriptions on component destruction
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  protected readonly environment = environment;
}