import { Component, Input, Output, EventEmitter } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
  imports: [
    ReactiveFormsModule,
    NgIf
  ]
})
export class EditProfileComponent {
  @Input() isProvider: boolean = false;
  @Input() profileData: any;
  @Output() closeModal = new EventEmitter<void>();
  @Output() profileUpdated = new EventEmitter<void>();

  profileForm!: FormGroup;
  isSubmitting = false;
  profileImage: File | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.profileForm = this.fb.group({
      avatar: [null],
      phone: [this.profileData?.phone || ''],
      location: [this.profileData?.location || ''],
      about: [this.isProvider ? this.profileData?.about || '' : ''],
      contact_email: [this.isProvider ? this.profileData?.contact_email || '' : ''],
      linkedin: [this.isProvider ? this.profileData?.linkedin || '' : ''],
      twitter: [this.isProvider ? this.profileData?.twitter || '' : ''],
      facebook: [this.isProvider ? this.profileData?.facebook || '' : ''],
    });
  }

  private submitFormData(endpoint: string): void {
    this.isSubmitting = true;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    });

    const formData = new FormData();

    Object.entries(this.profileForm.value).forEach(([key, value]) => {
      if (value) formData.append(key, value as string | Blob);
    });

    if (this.profileImage) {
      formData.append('avatar', this.profileImage);
    }

    console.log('Submitting form to:', endpoint);
    console.log('FormData:', Array.from(formData.entries()));

    this.http.post(endpoint, formData, { headers }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.profileUpdated.emit();
        this.closeModal.emit();
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        this.isSubmitting = false;
      },
    });
  }

  submitForm(): void {
    const endpoint = this.isProvider
      ? `${environment.apiUrl}/providers/update/`
      : `${environment.apiUrl}/profiles/update/`;

    this.submitFormData(endpoint);
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.profileImage = fileInput.files[0];
    }
  }

  protected readonly close = close;
}
