import { Injectable } from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {Provider} from 'app/shared/models/provider.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = environment.apiUrl + '/profiles';

  constructor(private http: HttpClient) { }

  checkProvider(userId: number): Observable<boolean> {
    return this.http.get<{ is_provider: boolean }>(`${this.apiUrl}/is_provider/${userId}`)
      .pipe(
        map(response => response.is_provider)
      );
  }
}
