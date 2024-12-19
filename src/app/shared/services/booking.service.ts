import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private apiUrl = environment.apiUrl + '/bookings';

  constructor(private http: HttpClient) {}

  getUserBookings(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/customer`, { headers });
  }

  updateBookingStatus(bookingId: number, data: { status: string }): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.patch(`${this.apiUrl}/${bookingId}/update`, data, { headers });
  }

  createBooking(data: { service_id: number; scheduled_time: string; details: string }): Observable<any> {
    const headers = this.getAuthHeaders();
    console.log('Booking data:', data);
    console.log('Headers:', headers);
    return this.http.post(`${this.apiUrl}/add`, data, { headers });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
}
