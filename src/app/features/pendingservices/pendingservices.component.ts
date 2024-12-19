import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {Service} from "app/shared/models/service.model";
import { environment } from 'environments/environment';

@Component({
  selector: 'app-pendingservices',
  templateUrl: './pendingservices.component.html',
  imports: [
    NgIf,
    NgForOf,
    ReactiveFormsModule,
    FormsModule,
  ],
  styleUrls: ['./pendingservices.component.css']
})
export class PendingservicesComponent implements OnInit {
  private apiUrl = environment.apiUrl
  private servicesUrl = this.apiUrl + '/services/pending'
  private updateUrl = this.apiUrl + '/services/update';
  services: Service[] = [];

  private token = localStorage.getItem('accessToken');

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.fetchServices();
  }

  fetchServices(): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    });
    this.http.get<any[]>(this.servicesUrl, {headers}).subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.services = data;
        } else {
          this.services = [data];
        }
        console.log('Serviços:', this.services);
      },
      error: (error) => {
        console.error('Erro ao buscar os serviços:', error);
      }

    });
  }

  approveService(serviceId: number): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    });

    this.http.put(`${this.apiUrl}/admin/services/${serviceId}/update`, {approval: 'approved'}, {headers}).subscribe({
      next: () => {
        console.log('Service approved successfully!');
        this.fetchServices(); // Refresh the list of pending services
      },
      error: (error) => {
        console.error('Error approving the service:', error);
      }
    });
  }

  rejectService(serviceId: number): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    });

    this.http.put(`${this.apiUrl}/admin/services/${serviceId}/update`, {approval: 'rejected'}, {headers}).subscribe({
      next: () => {
        console.log('Service rejected successfully!');
        this.fetchServices(); // Refresh the list of pending services
      },
      error: (error) => {
        console.error('Error rejecting the service:', error);
      }
    });
  }
}


