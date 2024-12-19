import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { MyServicesService } from 'app/shared/services/myservices.service';
import { Router } from '@angular/router';
import { Category } from 'app/shared/models/category.model';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {environment} from '../../../environments/environment';
import {AddServiceComponent} from 'app/features/myservices/add-service/add-service.component';

@Component({
  selector: 'app-myservices',
  templateUrl: './myservices.component.html',
  styleUrls: ['./myservices.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    AddServiceComponent
  ]
})
export class MyServicesComponent implements OnInit {
  services: any[] = [];
  searchName: string = '';
  filterStatus: string = '';
  environment = environment;

  // Modal visibility toggle
  showModal: boolean = false;

  constructor(
    private myservicesService: MyServicesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.myservicesService
      .getServicesWithBookingCounts(this.searchName, this.filterStatus)
      .subscribe({
        next: (data) => {
          this.services = data;
        },
        error: (err) => console.error('Error fetching services:', err),
      });
  }

  onFilterChange(): void {
    this.loadServices();
  }

  openAddServiceModal(): void {
    this.showModal = true;
  }

  closeAddServiceModal(): void {
    this.showModal = false;
  }

  handleServiceAdded(): void {
    this.loadServices();
    this.closeAddServiceModal();
  }

  navigateToAddService(): void {
    this.router.navigate(['/add-service']);
  }

  navigateToPending(serviceId: number): void {
    this.router.navigate(['/myservices', serviceId, 'to-approve']);
  }

  navigateToInProgress(serviceId: number): void {
    this.router.navigate(['/myservices', serviceId, 'in-progress']);
  }
}
