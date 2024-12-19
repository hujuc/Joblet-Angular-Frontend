import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'app/shared/services/notification.service';
import { CommonModule } from '@angular/common';
import { Notification } from 'app/shared/models/notification.model';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    console.log('Loading notifications...');
    this.fetchNotifications();
  }

  fetchNotifications(): void {
    this.notificationService.getNotifications().subscribe({
      next: (data: Notification[]) => {
        this.notifications = data;
        console.log('Notifications:', this.notifications);
      },
      error: (error) => {
        console.error('Error fetching notifications:', error);
      },
    });
  }

  markAsRead(notificationId: number): void {
    console.log('Marking notification as read:', notificationId);
    this.notificationService.markAsRead(notificationId).subscribe({
      next: () => {
        const notification = this.notifications.find(
          (notification) => notification.id === notificationId
        );
        if (notification) {
          notification.read = true;
        }
      },
      error: (err) => console.error('Error marking notification as read:', err),
    });
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications = this.notifications.map(notification => ({
          ...notification,
          read: true,
        }));
        console.log('All notifications marked as read.');
      },
      error: (err) => console.error('Error marking all notifications as read:', err),
    });
  }

  hasUnreadNotifications(): boolean {
    return this.notifications.some(notification => !notification.read);
  }
}
