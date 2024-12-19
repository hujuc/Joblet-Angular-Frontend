import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AuthService} from 'app/shared/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [FormsModule]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  constructor(private authService: AuthService, private router: Router) { }

  login():void{
      this.authService.login(this.username, this.password).subscribe({
      next:() => this.router.navigate(['/']),
      error:() => alert('Login failed')
    });
    }
}
