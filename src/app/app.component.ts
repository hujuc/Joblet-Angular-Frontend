import { Component, OnInit } from '@angular/core';
import {Router, NavigationEnd, RouterLink, RouterOutlet} from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, RouterLink, RouterOutlet, NgIf],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'joblet';
  showBackGround = false;

  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentUrl = event.urlAfterRedirects;
        this.showBackGround = currentUrl.includes('/login') || currentUrl.includes('/register');
      }
    });
  }
}

