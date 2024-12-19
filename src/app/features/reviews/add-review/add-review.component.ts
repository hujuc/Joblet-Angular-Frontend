import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from 'app/../environments/environment';

@Component({
  selector: 'app-add-review',
  standalone: true,
  templateUrl: './add-review.component.html',
  imports: [ReactiveFormsModule],
})
export class AddReviewComponent {
  @Input() providerId!: number;
  @Output() reviewAdded = new EventEmitter<void>();

  reviewForm: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.reviewForm = this.fb.group({
      rating: [5, [Validators.required]],
      comment: ['', [Validators.required, Validators.maxLength(500)]],
    });
  }

  submitReview(): void {
    if (this.reviewForm.valid) {
      this.isSubmitting = true;

      const formData = {
        ...this.reviewForm.value,
        provider: this.providerId,
      };

      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('Access token not found. User might not be logged in.');
        this.isSubmitting = false;
        return;
      }

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      });

      this.http.post(`${environment.apiUrl}/reviews/add/`, formData, { headers }).subscribe({
        next: (response) => {
          console.log('Review submitted successfully:', response);
          this.isSubmitting = false;
          this.reviewForm.reset({ rating: 5 });
          this.reviewAdded.emit();
        },
        error: (err) => {
          console.error('Error submitting review:', err.error);
          this.isSubmitting = false;
        },
      });
    } else {
      console.error('Form is invalid. Please check the inputs.');
    }
  }
}
