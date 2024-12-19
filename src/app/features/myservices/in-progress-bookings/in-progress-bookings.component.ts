import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MyServicesService } from 'app/shared/services/myservices.service';

@Component({
  selector: 'app-in-progress-bookings',
  templateUrl: './in-progress-bookings.component.html',
  styleUrls: ['./in-progress-bookings.component.css'],
})
export class InProgressBookingsComponent implements OnInit {
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
    this.loadInProgressBookings();
  }

  loadInProgressBookings(): void {
    this.myServicesService.getInProgressBookings(this.serviceId).subscribe({
      next: (data) => {
        this.serviceTitle = data.service_title;
        this.renderBookings(data.bookings);
      },
      error: (err) => console.error('Error fetching in-progress bookings:', err),
    });
  }

  renderBookings(bookings: any[]): void {
    const container = this.elementRef.nativeElement.querySelector('#bookings-container');
    container.innerHTML = '';

    if (bookings.length === 0) {
      const noBookings = this.renderer.createElement('p');
      this.renderer.setProperty(noBookings, 'innerText', 'No bookings in progress found for this service.');
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
              <p>Status: ${booking.status}</p>
              <a class="btn btn-sm btn-primary text-white mt-4" href="/chat/${booking.id}">Chat</a>
            </div>
          `
        );
        this.renderer.appendChild(container, card);
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/myservices']);
  }
}
