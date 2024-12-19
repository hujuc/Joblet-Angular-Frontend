import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForOf, NgIf, DatePipe } from '@angular/common';
import { Review } from 'app/shared/models/review.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-review-list',
  standalone: true,
  templateUrl: './review-list.component.html',
  imports: [NgForOf, NgIf, DatePipe],
})
export class ReviewListComponent implements OnInit {
  @Input() providerId!: number;
  reviews: Review[] = [];
  isLoading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchReviews();
  }

  fetchReviews(): void {
    const base_url = environment.apiUrl;
    this.http.get<Review[]>(`${base_url}/reviews/${this.providerId}/`).subscribe({
      next: (data) => {
        this.reviews = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching reviews:', err);
        this.isLoading = false;
      },
    });
  }
}
