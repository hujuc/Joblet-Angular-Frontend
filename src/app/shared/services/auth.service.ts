import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'environments/environment';
import {ProfileService} from 'app/shared/services/profile.service';
import { jwtDecode } from 'jwt-decode';
import { Profile } from 'app/shared/models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private userUrl = environment.apiUrl + '/users/';
  private authUrl = this.apiUrl + '/token/';
  private refreshUrl = this.apiUrl + '/token/refresh/';
  private logoutUrl = this.apiUrl + '/token/logout/';

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: string | null = null;
  admin: boolean = false;
  provider: boolean = false;
  userData
  username: string = '';
  userId: number;

  private isAuthenticatedSubject: BehaviorSubject<boolean>;

  constructor(private http: HttpClient, private profileService: ProfileService) {
    const storedUser = localStorage.getItem('currentUser');
    const accessToken = this.getAccessToken();

    this.currentUserSubject = new BehaviorSubject<any>(
      storedUser ? JSON.parse(storedUser) : null
    );

    this.userData = sessionStorage.getItem('userData')
    this.currentUser = sessionStorage.getItem('currentUser');
    this.username = this.currentUserSubject.value;
    this.currentUserSubject = new BehaviorSubject<any>(storedUser ? JSON.parse(storedUser) : null);
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(!!accessToken);
    this.admin = this.isAdmin();
    this.userId = this.userData ? JSON.parse(this.userData).id : 0;
  }

  getUserId(){
    return this.userId;
  }

  isAdmin(): boolean {
    const role = sessionStorage.getItem('role');
    console.log('Role:', role);
    return role === 'admin';
  }

  getCurrentUserValue(): any {
    return this.currentUser;
  }

  getUserInformation(): void {
    const username = sessionStorage.getItem('currentUser');

    if (!username) {
      console.error('No current user found in sessionStorage.');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getAccessToken()}`,
    });

    this.http.get<any>(`${this.userUrl}${username}/`, {headers}).subscribe({
      next: (userData) => {
        sessionStorage.setItem('userData', JSON.stringify(userData));
        console.log('User information fetched and stored:', userData);
      },
      error: (error) => {
        console.error('Error fetching user information:', error);
      }
    });
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.authUrl, { username, password }).pipe(
      map((tokens) => {
        localStorage.setItem('accessToken', tokens.access);
        localStorage.setItem('refreshToken', tokens.refresh);

        const decodedToken: any = jwtDecode(tokens.access);
        sessionStorage.setItem('role', decodedToken.role);

        this.currentUserSubject.next(username);
        this.isAuthenticatedSubject.next(true);

        this.getUserInformation();

        return tokens;
      })
    );
  }


  logout(): void {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      this.http.post(this.logoutUrl, { refresh: refreshToken }).subscribe();
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('userData');

    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<any>(this.refreshUrl, { refresh: refreshToken }).pipe(
      map((tokens) => {
        localStorage.setItem('accessToken', tokens.access);
        this.isAuthenticatedSubject.next(true);
        return tokens;
      })
    );
  }

  isAuthenticated(): Observable<boolean> {
    const token = this.getAccessToken();
    const isLoggedIn = !!token;


    this.isAuthenticatedSubject.next(isLoggedIn);

    return this.isAuthenticatedSubject.asObservable();
  }


  getMyProfile(): Observable<Profile> {
    return this.http.get<Profile>(`${this.apiUrl}/profiles/me`, {
      headers: { Authorization: `Bearer ${this.getAccessToken()}` }
    });
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }
}


