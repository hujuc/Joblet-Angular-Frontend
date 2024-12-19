import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private apiUrl = `${environment.apiUrl}/wallet/`;

  constructor(private http: HttpClient) {}

  getWalletBalance(): Observable<{ wallet: number }> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    });
    return this.http.get<{ wallet: number }>(this.apiUrl, { headers });
  }

  updateWallet(action: 'add' | 'withdraw', amount: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    });

    return this.http.post(this.apiUrl, { action, amount }, { headers });
  }
}
