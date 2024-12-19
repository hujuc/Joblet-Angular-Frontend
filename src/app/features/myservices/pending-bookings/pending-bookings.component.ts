import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MyServicesService } from 'app/shared/services/myservices.service';

@Component({
  selector: 'app-pending-bookings',
  templateUrl: './pending-bookings.component.html',
  styleUrls: ['./pending-bookings.component.css'],
})
export class PendingBookingsComponent implements OnInit {
  serviceTitle: string = '';
  serviceId: number;

  constructor(
    private route: ActivatedRoute,
    private myServicesService: MyServicesService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private router: Router
  ) {
    this.serviceId = +this.route.snapshot.paramMap.get('serviceId')!;
  }

  ngOnInit(): void {
    this.loadPendingBookings();
  }

  loadPendingBookings(): void {
    this.myServicesService.getPendingBookings(this.serviceId).subscribe({
      next: (data) => {
        this.serviceTitle = data.service_title;
        this.renderBookings(data.bookings);
      },
      error: (err) => console.error('Error fetching pending bookings:', err),
    });
  }

  renderBookings(bookings: any[]): void {
    const container = this.elementRef.nativeElement.querySelector('#bookings-container');
    container.innerHTML = '';

    if (bookings.length === 0) {
      const noBookings = this.renderer.createElement('p');
      this.renderer.setProperty(noBookings, 'innerText', 'No pending bookings found for this service.');
      this.renderer.addClass(noBookings, 'text-gray-500');
      this.renderer.appendChild(container, noBookings);
    } else {
      bookings.forEach((booking) => {
        const card = this.renderer.createElement('div');
        this.renderer.addClass(card, 'card');
        this.renderer.addClass(card, 'bg-base-100');
        this.renderer.addClass(card, 'shadow-md');
        this.renderer.addClass(card, 'mb-4');

        this.renderer.setProperty(
          card,
          'innerHTML',
          `
          <div class="card-body">
            <p>Customer: ${booking.customer.username}</p>
            <p>Scheduled Date: ${booking.scheduled_time}</p>
            <p>Details: ${booking.details}</p>
            <div class="flex gap-2 mt-4">
              <button id="approve-${booking.id}" class="btn btn-sm btn-success">Approve</button>
              <button id="reject-${booking.id}" class="btn btn-sm btn-danger">Reject</button>
            </div>
          </div>
        `
        );

        this.renderer.appendChild(container, card);

        const approveButton = card.querySelector(`#approve-${booking.id}`);
        this.renderer.listen(approveButton, 'click', () => this.approveBooking(booking.id));

        const rejectButton = card.querySelector(`#reject-${booking.id}`);
        this.renderer.listen(rejectButton, 'click', () => this.rejectBooking(booking.id));
      });
    }
  }


  goBack(): void {
    this.router.navigate(['/myservices']);
  }

  approveBooking(bookingId: number): void {
    this.myServicesService.approveBooking(bookingId).subscribe({
      next: () => {
        alert('Booking approved successfully!');
        this.loadPendingBookings();
      },
      error: (err) => {
        console.error('Error approving booking:', err);
        alert('Failed to approve booking.');
      },
    });
  }

  rejectBooking(bookingId: number): void {
    this.myServicesService.rejectBooking(bookingId).subscribe({
      next: () => {
        alert('Booking rejected successfully!');
        this.loadPendingBookings();
      },
      error: (err) => {
        console.error('Error rejecting booking:', err);
        alert('Failed to reject booking.');
      },
    });
  }

}
