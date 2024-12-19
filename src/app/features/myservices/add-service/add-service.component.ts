import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { ServiceService } from 'app/shared/services/service.service';
import { Category } from 'app/shared/models/category.model';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    NgForOf
  ]
})
export class AddServiceComponent implements OnInit {
  @Output() serviceAdded = new EventEmitter<void>();

  formData = {
    title: '',
    description: '',
    price: 0,
    duration: 0,
    category_id: 0,
    image: null,
  };

  categories: Category[] = [];
  environment = environment; // Declare environment for template access

  constructor(private serviceService: ServiceService, private router: Router) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.serviceService.getCategories().subscribe({
      next: (data) => {
        console.log('Fetched categories:', data); // Debugging
        this.categories = data;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      },
    });
  }

  onImageChange(event: any): void {
    this.formData.image = event.target.files[0];
  }

  addService(): void {
    const formData = new FormData();
    formData.append('title', this.formData.title);
    formData.append('description', this.formData.description);
    formData.append('price', this.formData.price.toString());
    formData.append('duration', this.formData.duration.toString());
    formData.append('category_id', this.formData.category_id.toString());
    if (this.formData.image) {
      formData.append('image', this.formData.image);
    }

    this.serviceService.addService(formData).subscribe({
      next: () => {
        alert('Service added successfully!');
        this.serviceAdded.emit(); // Notify the parent component
      },
      error: (error) => {
        console.error('Error adding service:', error);
        alert('Failed to add service.');
      },
    });
  }
}
