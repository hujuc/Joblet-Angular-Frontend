import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../shared/services/service.service';
import { Service } from 'app/shared/models/service.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import {Category} from 'app/shared/models/category.model';
import {CategoryService} from 'app/shared/services/category.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  imports: [FormsModule, CommonModule, NgForOf, NgIf, RouterLink],
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  services: Service[] = [];
  filteredServices: Service[] = [];
  searchQuery: string = '';
  selectedCategoryId: number | null = null;
  categories: Category[] | undefined;

  constructor(
    private servicesService: ServiceService,
    private route: ActivatedRoute,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.selectedCategoryId = params['category'] ? Number(params['category']) : null;
      this.fetchServices();
      this.fetchCategories();
    });
  }

  fetchServices(): void {
    if (this.selectedCategoryId) {
      this.servicesService.getServiceByCategory(this.selectedCategoryId).subscribe((data: Service[]) => {
        this.services = data;
        this.applyFilters();
      });
    } else {
      this.servicesService.getServices().subscribe((data: Service[]) => {
        this.services = data;
        this.applyFilters();
      });
    }
  }

  fetchCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Failed to fetch categories:', error);
      }
    });
  }

  applyFilters(): void {
    this.filteredServices = this.services.filter((service) =>
      service.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  onSearch(): void {
    this.applyFilters();
  }

  onCategoryChange(categoryId: number | null): void {
    this.selectedCategoryId = categoryId;
    this.fetchServices();
  }

  trackById(index: number, service: Service): number {
    return service.id;
  }

  protected readonly environment = environment;
}
