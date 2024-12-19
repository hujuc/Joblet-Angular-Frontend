import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { NgIf, SlicePipe, UpperCasePipe } from '@angular/common';
import { environment } from 'environments/environment';
import { Profile } from 'app/shared/models/profile.model';
import { ReviewListComponent } from 'app/features/reviews/review-list/review-list.component';
import { AddReviewComponent } from 'app/features/reviews/add-review/add-review.component';
import { AuthService } from 'app/shared/services/auth.service';
import { ProfileService } from 'app/shared/services/profile.service';
import {EditProfileComponent} from 'app/features/profile/edit-profile/edit-profile.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [
    SlicePipe,
    UpperCasePipe,
    NgIf,
    ReviewListComponent,
    AddReviewComponent,
    EditProfileComponent
  ],
})
export class ProfileComponent implements OnInit {
  private profileUrl = `${environment.apiUrl}/profiles/one`;
  profileData: Profile | null = null;
  isLoading: boolean = true;
  error: string | null = null;
  showAddReviewModal = false;
  isOwner = false;
  showEditModal = false;
  mediaUrl = environment.mediaUrl;
  private token = localStorage.getItem('accessToken');

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const username = params['username'];
      if (username) {
        this.fetchUser(username);
      } else {
        this.handleError('No username provided.');
      }
    });
  }

  fetchUser(username: string): void {
    if (!this.token) {
      console.error('Token de autenticação não encontrado!');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    });
    this.isLoading = true;
    this.http.get<Profile>(`${this.profileUrl}/${username}/`, {headers}).subscribe({
      next: (data) => {
        this.profileData = data;
        console.log('User data:', this.profileData);
        this.isLoading = false;
      },
      error: (err) => {
        this.handleError('Failed to load user data.');
        console.error('Error fetching user:', err);
      },
    });
  }

  handleReviewAdded(): void {
    this.showAddReviewModal = false;
  }

  private handleError(message: string): void {
    this.error = message;
    this.isLoading = false;
  }
}
