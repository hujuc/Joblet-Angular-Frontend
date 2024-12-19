import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'app/shared/services/auth.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-becameaprovider',
  templateUrl: './becameaprovider.component.html',
  styleUrls: ['./becameaprovider.component.css'],
})
export class BecameaproviderComponent implements OnInit {
  userId: number | null = null;
  private providerUrl = `${environment.apiUrl}/providers/create/`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchUserId();
  }

  fetchUserId(): void {
    this.authService.getMyProfile().subscribe({
      next: (profile) => {
        this.userId = profile.id;
        console.log('User ID:', this.userId);
      },
      error: (err) => {
        console.error('Error fetching user profile:', err);
        this.userId = null;
      },
    });
  }

  becameAProvider() {
    if (!this.userId) {
      console.error('User ID is not available');
      alert('User ID is not available. Please try again.');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    });

    this.http.post<any>(`${this.providerUrl}${this.userId}`, {}, { headers }).subscribe({
      next: (response) => {
        console.log('Provider created successfully:', response);
        alert('You are now a provider!');
      },
      error: (err) => {
        console.error('Error creating provider:', err);
        alert('Failed to become a provider. Please try again.');
      },
    });
  }
}
