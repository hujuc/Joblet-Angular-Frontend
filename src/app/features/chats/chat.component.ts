import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'app/shared/services/auth.service';
import { ChatsService } from 'app/shared/services/chats.service';
import { Message } from 'app/shared/models/message.model';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  imports: [
    NgClass,
    NgForOf,
    NgIf,
    DatePipe,
    ReactiveFormsModule
  ],
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatContainer', { static: false }) private chatContainer!: ElementRef<HTMLElement>;
  chatId!: number;
  messages: Message[] = [];
  messageForm!: FormGroup;
  userId!: number;
  isLoading: boolean = true;
  file: File | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private chatsService: ChatsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.chatId = Number(this.route.snapshot.paramMap.get('id'));
    this.initializeForm();
    this.getCurrentUser();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  initializeForm(): void {
    this.messageForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  getCurrentUser(): void {
    this.authService.getMyProfile().subscribe({
      next: (profile) => {
        this.userId = profile.id;
        this.loadMessages();
      },
      error: (err) => console.error('Failed to load user info', err)
    });
  }

  loadMessages(): void {
    this.chatsService.getMessages(this.chatId).subscribe({
      next: (data) => {
        this.messages = data;
        console.log('Messages:', this.messages);
        this.isLoading = false;
      },
      error: () => {
        console.error('Failed to load messages.');
        this.isLoading = false;
      }
    });
  }

  handleFileInput(event: Event): void {
    const element = event.target as HTMLInputElement;
    const files = element.files;
    if (files && files.length > 0) {
      this.file = files[0];
    }
  }

  sendMessage(): void {
    if (this.messageForm.valid || this.file) {
      const formData = new FormData();
      formData.append('content', this.messageForm.get('content')?.value || '');

      if (this.file) {
        formData.append('file', this.file);
      }

      this.chatsService.sendMessage(this.chatId, formData).subscribe({
        next: (newMessage) => {
          this.messages.push(newMessage);
          this.messageForm.reset();
          this.file = null;
          this.scrollToBottom();
        },
        error: (err) => console.error('Failed to send message:', err),
      });
    }
  }

  scrollToBottom(): void {
    if (this.chatContainer && this.chatContainer.nativeElement) {
      setTimeout(() => {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }, 100);
    }
  }

  protected readonly environment = environment;
}
