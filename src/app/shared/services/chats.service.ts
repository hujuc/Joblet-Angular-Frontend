import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import { Message } from 'app/shared/models/message.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {
  private apiUrl = environment.apiUrl + '/chats';

  constructor(private http: HttpClient) {}

  getChats(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    });

    return this.http.get(this.apiUrl, { headers });
  }

  getChatIdByBooking(bookingId: number): Observable<{ chat_id: number }> {
    return this.http.get<{ chat_id: number }>(`${this.apiUrl}/by-booking/${bookingId}/`);
  }

  getMessages(chatId: number): Observable<Message[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`
    });

    return this.http.get<Message[]>(`${this.apiUrl}/${chatId}/messages/`, { headers });
  }

  sendMessage(chatId: number, messageData: FormData): Observable<Message> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    });

    return this.http.post<Message>(`${this.apiUrl}/${chatId}/send/`, messageData, { headers });
  }
}
