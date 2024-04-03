import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  isLoggedIn: boolean = false;
  logo: string = './../assets/logo.png';
  isMobileMenuOpen: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  logout(): void {
    this.router.navigate(['home']);
    this.authService.logout();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
