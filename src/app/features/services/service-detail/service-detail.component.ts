import {Component, OnInit} from '@angular/core';
import {Service} from 'app/shared/models/service.model';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {ServiceService} from 'app/shared/services/service.service';
import {AuthService} from 'app/shared/services/auth.service';
import {DatePipe, DecimalPipe, NgForOf, NgIf, SlicePipe, UpperCasePipe} from '@angular/common';
import {BookServiceComponent} from 'app/features/services/service-detail/book-service/book-service.component';
import {environment} from 'environments/environment';
import { CarouselModule } from 'ngx-bootstrap/carousel';

@Component({
  selector: 'app-service-detail',
  imports: [
    NgIf,
    DatePipe,
    DecimalPipe,
    UpperCasePipe,
    SlicePipe,
    BookServiceComponent,
    CarouselModule,
    NgForOf,
  ],
  templateUrl: './service-detail.component.html',
  styleUrl: './service-detail.component.css',
})
export class ServiceDetailComponent implements OnInit {
  service: Service | null = null;

  showBookingModal: boolean = false;
  bookingTime: string = '';
  bookingDetails: string = '';
  avgRating: number | undefined;
  reviewsCount: number | undefined;
  relatedServices: Service[] = [];
  isLoggedIn = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serviceService: ServiceService,
    private authService: AuthService,
  ) {
    this.authService.getAuthStatus().subscribe((status) => {
      this.isLoggedIn = status;
    });
  }

  ngOnInit(): void {
    const serviceId = this.route.snapshot.paramMap.get('id');
    if (serviceId) {
      this.fetchServiceDetails(+serviceId);
    }
  }

  get isBookable(): boolean {
    return this.isLoggedIn || false;
  }

  fetchServiceDetails(id: number): void {
    this.serviceService.getServiceById(id).subscribe((data: Service) => {
      this.service = data;
      console.log('Service:', this.service);

      if (this.service?.category?.id) {
        this.fetchRelatedServices(this.service.category.id);
      }
    });
  }

  fetchRelatedServices(categoryId: number): void {
    this.serviceService.getServiceByCategory(categoryId).subscribe((services: Service[]) => {
      this.relatedServices = services.filter((s) => s.id !== this.service?.id);
    });
  }

  goBack(): void {
    window.history.back();
  }


  openModal(): void {
    this.showBookingModal = true;
  }

  closeModal(): void {
    this.showBookingModal = false;
  }

  navigateToService(serviceId: number): void {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/service', serviceId]);
    });
  }


  bookService(): void {
    console.log('Booking Service:', this.bookingTime, this.bookingDetails);
    this.closeModal();
  }

  protected readonly environment = environment;
}