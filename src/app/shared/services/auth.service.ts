import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'environments/environment';
import {ProfileService} from 'app/shared/services/profile.service';
import { jwtDecode } from 'jwt-decode';
import { Profile } from 'app/shared/models/profile.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private userUrl = `${this.apiUrl}/users/`;
  private authUrl = `${this.apiUrl}/token/`;
  private refreshUrl = `${this.apiUrl}/token/refresh/`;
  private logoutUrl = `${this.apiUrl}/token/logout/`;

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser$: Observable<any>;
  private isAuthenticatedSubject: BehaviorSubject<boolean>;
  public isAuthenticated$: Observable<boolean>;

  private userData: any | null = null;
  private username: string | null = null;
  private userId: number | null = null;

  constructor(private http: HttpClient) {
    // Initialize subjects from storage
    const storedUser = localStorage.getItem('currentUser');
    const accessToken = this.getAccessToken();

    this.currentUserSubject = new BehaviorSubject<any>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser$ = this.currentUserSubject.asObservable();

    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(!!accessToken);
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    // Initialize user info
    this.userData = sessionStorage.getItem('userData');
    this.username = storedUser || null;
    this.userId = this.userData ? JSON.parse(this.userData).id : null;
  }

  // Fetch current user ID
  getUserId(): number | null {
    return this.userId;
  }

  // Check if the user is an admin
  isAdmin(): boolean {
    const role = sessionStorage.getItem('role');
    return role === 'admin';
  }

  // Fetch user information and store in session storage
  fetchUserInformation(): void {
    const username = sessionStorage.getItem('currentUser');
    if (!username) {
      console.error('No current user found in sessionStorage.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getAccessToken()}`,
    });

    this.http.get<any>(`${this.userUrl}${username}/`, { headers }).subscribe({
      next: (userData) => {
        sessionStorage.setItem('userData', JSON.stringify(userData));
        this.userData = userData;
        this.userId = userData.id;
      },
      error: (error) => {
        console.error('Error fetching user information:', error);
      },
    });
  }

  // Log in the user and fetch tokens
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.authUrl, { username, password }).pipe(
      map((tokens) => {
        localStorage.setItem('accessToken', tokens.access);
        localStorage.setItem('refreshToken', tokens.refresh);

        const decodedToken: any = jwtDecode(tokens.access);
        sessionStorage.setItem('role', decodedToken.role);
        sessionStorage.setItem('currentUser', username);

        this.username = username;
        this.currentUserSubject.next(username);
        this.isAuthenticatedSubject.next(true);

        // Fetch user information after login
        this.fetchUserInformation();

        return tokens;
      })
    );
  }

  // Log out the user and clear session storage
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

    this.username = null;
    this.userId = null;
    this.userData = null;
  }

  // Check if the user is authenticated (observable)
  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticated$;
  }

  // Get access token from local storage
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // Refresh the token
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

  getMyProfile(): Observable<Profile> {
    return this.http.get<Profile>(`${this.apiUrl}/profiles/me`, {
      headers: { Authorization: `Bearer ${this.getAccessToken()}` }
    });
  }

  getAuthStatus(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }
}
