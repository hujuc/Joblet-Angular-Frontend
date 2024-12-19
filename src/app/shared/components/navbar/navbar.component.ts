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
  showProfileDropdown = false;
  isProvider = false;
  hideNavbar = false;
  profile: Profile | null = null;
  unreadNotificationsCount = 0;

  private authSubscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private categoryService: CategoryService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    // Subscribe to authentication state changes
    this.authSubscription = this.authService.isAuthenticated().subscribe((status) => {
      this.isLoggedIn = status;
      this.isAdmin = this.authService.isAdmin();
    });

    // Hide navbar on specific routes
    this.router.events.subscribe(() => {
      this.hideNavbar = this.router.url.includes('/login') || this.router.url.includes('/register');
    });

    this.fetchCategories();
    this.fetchUserInfoAndCheckProvider();
    this.fetchUnreadNotificationsCount();
  }

  fetchCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data: Category[]) => {
        this.categories = data;
      },
      error: () => {
        console.error('Failed to fetch categories.');
      },
    });
  }

  toggleProfileDropdown() {
    this.showProfileDropdown = !this.showProfileDropdown;
  }

  closeProfileDropdown() {
    this.showProfileDropdown = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  fetchUserInfoAndCheckProvider() {
    this.authService.getMyProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.checkProvider(this.profile);
      },
      error: () => {
        this.profile = null;
      },
    });
  }

  checkProvider(profile: Profile | null = null): boolean {
    if (profile) {
      this.profileService.checkProvider(profile.user.id).subscribe({
        next: (status) => {
          this.isProvider = status;
        },
        error: (err) => {
          console.error('Error checking provider status:', err);
          this.isProvider = false;
        },
      });
    }
    return this.isProvider;
  }


  fetchUnreadNotificationsCount(): void {
    this.notificationService.getUnreadCount().subscribe({
      next: (count) => {
        this.unreadNotificationsCount = count;
        console.log('Unread notifications count:', this.unreadNotificationsCount);
      },
      error: (err) => console.error('Error fetching unread notifications count:', err),
    });
  }


  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
  }

  protected readonly environment = environment;
}
