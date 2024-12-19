import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatsService } from 'app/shared/services/chats.service';
import { Chat } from 'app/shared/models/chat.model';
import { AuthService } from 'app/shared/services/auth.service';
import { DatePipe, NgForOf, NgIf, SlicePipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-my-chats',
  templateUrl: './my-chats.component.html',
  styleUrls: ['./my-chats.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    DatePipe,
    SlicePipe,
    UpperCasePipe
  ]
})
export class MyChatsComponent implements OnInit {
  isProvider: boolean = false;
  isLoading: boolean = true;
  customerChats: Chat[] = [];
  providerChats: Chat[] = [];

  constructor(
    private chatsService: ChatsService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserType();
    this.fetchChats();
  }

  private loadUserType(): void {
    this.authService.getMyProfile().subscribe({
      next: (profile) => {
        this.isProvider = profile.is_provider;
      },
      error: (err) => {
        console.error('Error loading user type:', err);
      },
    });
  }

  private fetchChats(): void {
    this.chatsService.getChats().subscribe({
      next: (data) => {
        console.log('Chats:', data);
        this.customerChats = data.customer_chats || [];
        this.providerChats = data.provider_chats || [];
        console.log('Customer chats:', this.customerChats);
        console.log('Provider chats:', this.providerChats);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching chats:', err);
        this.isLoading = false;
      },
    });
  }

  viewChat(id: number): void {
    this.router.navigate(['/chat', id]);
  }
}
