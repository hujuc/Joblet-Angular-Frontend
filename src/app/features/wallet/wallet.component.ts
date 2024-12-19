import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import {CurrencyPipe, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { WalletService } from 'app/shared/services/wallet.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  imports: [
    NgIf,
    FormsModule,
    CurrencyPipe
  ],
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {
  walletBalance: number = 0;
  amount: number = 0;
  message: string | null = null;
  isLoading: boolean = true;
  isSubmitting: boolean = false;
  actionType: string | null = null;

  constructor(private http: HttpClient, private walletService: WalletService) { }

  ngOnInit(): void {
    this.fetchWalletBalance();
  }

  fetchWalletBalance(): void {
    this.walletService.getWalletBalance().subscribe({
      next: (data) => {
        this.walletBalance = data.wallet;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching wallet balance:', err);
        this.isLoading = false;
      }
    });
  }

  performAction(action: 'add' | 'withdraw'): void {
    if (!this.amount || this.amount <= 0) {
      this.message = 'Please enter a valid amount.';
      return;
    }

    this.isSubmitting = true;
    this.actionType = action;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`
    });

    const payload = { action, amount: this.amount };

    this.http.post<{ wallet: number, message: string }>(`${environment.apiUrl}/wallet/`, payload, { headers })
      .subscribe({
        next: (data) => {
          this.walletBalance = data.wallet;
          this.message = data.message;
          this.amount = 0;
          this.isSubmitting = false;
          this.actionType = null;
        },
        error: (err) => {
          console.error('Error performing action:', err);
          this.message = 'Failed to perform action. Please try again.';
          this.isSubmitting = false;
          this.actionType = null;
        }
      });
  }
}
