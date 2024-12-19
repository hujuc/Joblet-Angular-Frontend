import { Component, OnInit } from '@angular/core';
import { HomeService } from 'app/shared/services/home.service';
import { NgClass, NgForOf, NgIf, SlicePipe, UpperCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Provider } from 'app/shared/models/provider.model';
import { Booking } from 'app/shared/models/booking.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [
    NgIf,
    NgForOf,
    SlicePipe,
    UpperCasePipe,
    RouterLink,
    NgClass
  ],
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  homeDataStats: any[] = [];
  recentBookings: Booking[] = [];
  topProviders: Provider[] = [];

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.fetchHomeData();
  }

  fetchHomeData(): void {
    this.homeService.getHomeData().subscribe({
      next: (data) => {
        this.recentBookings = data.recent_bookings;
        this.topProviders = data.top_providers;

        this.homeDataStats = [
          { label: 'Users', value: data.total_users, icon: 'fas fa-users' },
          { label: 'Providers', value: data.total_providers, icon: 'fas fa-user-tie' },
          { label: 'Reviews', value: data.total_reviews, icon: 'fas fa-star' },
          { label: 'Services', value: data.total_services, icon: 'fa-solid fa-briefcase' },
          { label: 'Services Provided', value: data.total_services_provided, icon: 'fas fa-handshake' },
          { label: 'Total Revenue', value: `${data.total_revenue}€`, icon: 'fas fa-euro-sign' }
        ];

        console.log(this.homeDataStats);
      },
      error: (err) => console.error('Error fetching home data:', err)
    });
  }

  protected readonly environment = environment;
}


