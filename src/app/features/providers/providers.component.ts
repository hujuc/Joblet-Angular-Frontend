import { Component, OnInit } from '@angular/core';
import { Provider } from 'app/shared/models/provider.model';
import { ProviderService } from 'app/shared/services/provider.service';
import {RouterLink} from '@angular/router';
import {NgForOf, NgIf, SlicePipe, UpperCasePipe} from '@angular/common';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.css'],
  imports: [
    RouterLink,
    SlicePipe,
    UpperCasePipe,
    NgIf,
    NgForOf
  ]
})
export class ProvidersComponent implements OnInit {
  providers: Provider[] = [];
  isLoading = true;

  constructor(private providerService: ProviderService) {}

  ngOnInit(): void {
    this.fetchProviders();
  }

  fetchProviders(): void {
    this.providerService.getProviders().subscribe({
      next: (data) => {
        this.providers = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching providers:', err);
        this.isLoading = false;
      },
    });
  }

  protected readonly environment = environment;
}
