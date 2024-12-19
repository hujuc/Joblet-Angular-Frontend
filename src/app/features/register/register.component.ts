import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-register',
  imports: [
    RouterLink,
    FormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  formData={
    username: '',
    password: '',
    password2: '',
    email: '',
    first_name: '',
    last_name: '',
  }


  constructor(private http: HttpClient, private router: Router) { }

  signup() {
    if (this.formData.password !== this.formData.password2) {
      alert('Passwords do not match');
      return;
    }

    const payload = {
      user: {
        username: this.formData.username,
        password: this.formData.password,
        email: this.formData.email,
        first_name: this.formData.first_name,
        last_name: this.formData.last_name,
      },
    };


    console.log(payload);
    this.http.post(environment.apiUrl + '/profiles/register', payload).subscribe({
      next: (response) => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        alert('Registration failed');
      },
    });
  }

}
