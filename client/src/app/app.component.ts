import { Component, DestroyRef, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  isLoggedIn: boolean = false;
  isMobileMenuOpen: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.checkLoggedInStatus();
  }

  checkLoggedInStatus(): void {
    this.authService
      .isLoggedIn()
      .pipe(
        tap((status: boolean) => (this.isLoggedIn = status)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['signin']);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
}
