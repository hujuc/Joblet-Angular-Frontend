import { Component, Input } from '@angular/core';
import { BookingService } from 'app/shared/services/booking.service';
import { ActivatedRoute } from '@angular/router';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-book-service',
  imports: [FormsModule],
  templateUrl: './book-service.component.html',
  styleUrl: './book-service.component.css'
})
export class BookServiceComponent {
  @Input() serviceId!: number; // Receive the service ID as input
  bookingTime = '';
  bookingDetails = '';

  constructor(private bookingService: BookingService, private route: ActivatedRoute) {}

  bookService(): void {
    const bookingData = {
      service_id: this.serviceId,
      scheduled_time: this.bookingTime,
      details: this.bookingDetails,
    };

    this.bookingService.createBooking(bookingData).subscribe({
      next: () => {
        alert('Booking successful!');
      },
      error: (err) => {
        console.error('Error:', err);
        const errorMessage = err?.error?.error || 'Booking failed! Please try again.';
        alert(errorMessage);
      }
    });
  }
}
