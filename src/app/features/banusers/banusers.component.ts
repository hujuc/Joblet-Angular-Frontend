import { Component } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-banusers',
  templateUrl: './banusers.component.html',
  styleUrls: ['./banusers.component.css'],
  imports: [
    NgIf,
    NgForOf,
    FormsModule
  ]
})
export class BanusersComponent {
  private usersUrl = 'http://127.0.0.1:8000/api/users';
  users: any[] = [];
  loading = true;
  error = '';

  private token = localStorage.getItem('accessToken');

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    if (!this.token) {
      console.error('Token de autenticação não encontrado!');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    });
    this.http.get<any[]>(this.usersUrl,{headers}).subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to fetch users';
        console.error('Error fetching users:', err);
        this.loading = false;
      },
    });
  }

  banUser(id: number): void {
    if (!this.token) {
      console.error('Token de autenticação não encontrado!');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    });
    console.log('Banning user with ID:', id);
    this.http.delete(`${this.usersUrl}/${id}/delete/`, { headers }).subscribe({
      next: () => {
        console.log('User banned successfully!');
        this.fetchUsers();
      },
      error: (err) => {
        console.error('Error banning user:', err);
      }
    });
  }

}

