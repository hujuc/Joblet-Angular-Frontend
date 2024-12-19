import { Component, OnInit } from '@angular/core';
import { BookingService } from 'app/shared/services/booking.service';
import { ChatsService } from 'app/shared/services/chats.service';
import { Booking } from 'app/shared/models/booking.model';
import { map } from 'rxjs/operators';
import {DatePipe, NgForOf, NgIf, UpperCasePipe} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-myorders',
  templateUrl: './myorders.component.html',
  imports: [
    DatePipe,
    UpperCasePipe,
    RouterLink,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./myorders.component.css']
})
export class MyOrdersComponent implements OnInit {
  pendingBookings: Booking[] = [];
  inProgressBookings: Booking[] = [];
  completedBookings: Booking[] = [];
  cancelledBookings: Booking[] = [];

  chatIds: { [bookingId: number]: number | null } = {};

  constructor(private bookingService: BookingService, private chatsService: ChatsService) {}

  ngOnInit(): void {
    this.fetchUserBookings();
  }

  fetchUserBookings(): void {
    this.bookingService.getUserBookings().subscribe({
      next: (bookings: Booking[]) => {
        this.pendingBookings = bookings.filter(b => b.status === 'pending');
        this.inProgressBookings = bookings.filter(b => b.status === 'in_progress');
        this.completedBookings = bookings.filter(b => b.status === 'completed');
        this.cancelledBookings = bookings.filter(b => b.status === 'cancelled');

        bookings.forEach((booking) => this.loadChatId(booking.id));
      },
      error: (err) => console.error('Error fetching bookings:', err),
    });
  }

  loadChatId(bookingId: number): void {
    this.chatsService.getChatIdByBooking(bookingId).pipe(
      map((data) => data?.chat_id || null)
    ).subscribe({
      next: (chatId) => {
        this.chatIds[bookingId] = chatId;
      },
      error: (err) => {
        console.error(`Error fetching chat for booking ${bookingId}:`, err);
        this.chatIds[bookingId] = null;
      },
    });
  }

  markAsCompleted(bookingId: number): void {
    this.bookingService.updateBookingStatus(bookingId, { status: 'completed' }).subscribe(() => {
      this.fetchUserBookings();
    });
  }
}
