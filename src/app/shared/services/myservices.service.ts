import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Service } from 'app/shared/models/service.model';
import { environment } from 'environments/environment';
import { Category } from 'app/shared/models/category.model';

@Injectable({
  providedIn: 'root',
})
export class MyServicesService {
  private apiUrl = environment.apiUrl;
  private categoriesUrl = environment.apiUrl + '/categories';

  constructor(private http: HttpClient) {
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getServicesWithBookingCounts(searchName: string = '', filterStatus: string = ''): Observable<any> {
    let params = new HttpParams();
    if (searchName) params = params.set('search_name', searchName);
    if (filterStatus) params = params.set('filter_status', filterStatus);

    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/myservices`, {headers, params});
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoriesUrl);
  }

  addService(serviceData: FormData): Observable<Service> {
    const headers = this.getAuthHeaders();
    return this.http.post<Service>(`${this.apiUrl}/add/`, serviceData, {headers});
  }

  updateService(serviceId: number, serviceData: FormData): Observable<Service> {
    const headers = this.getAuthHeaders();
    return this.http.put<Service>(`${this.apiUrl}/edit/${serviceId}/`, serviceData, {headers});
  }

  deleteService(serviceId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete<any>(`${this.apiUrl}/delete/${serviceId}/`, {headers});
  }

  getPendingBookings(serviceId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(
      `${this.apiUrl}/myservices/${serviceId}/pending_bookings`,
      { headers }
    );
  }

  getInProgressBookings(serviceId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(
      `${this.apiUrl}/myservices/${serviceId}/in_progress_bookings`,
      { headers }
    );
  }


  approveBooking(bookingId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(
      `${this.apiUrl}/myservices/${bookingId}/approve`,
      {},
      { headers }
    );
  }

  rejectBooking(bookingId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(
      `${this.apiUrl}/myservices/${bookingId}/reject`,
      {},
      { headers }
    );
  }
}
