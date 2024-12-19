import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { Notification } from 'app/shared/models/notification.model';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUrl = environment.apiUrl + '/notifications';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getUnreadCount(): Observable<number> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/unread-count`, {
      headers: this.getAuthHeaders(),
    })
      .pipe(
      map((response) => {
        return response.count;
      })
    );
  }

  markAsRead(notificationId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${notificationId}/mark-as-read/`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  markAllAsRead(): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/mark-all-as-read/`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }
}
