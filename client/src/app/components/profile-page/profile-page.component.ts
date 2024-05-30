import { Component, DestroyRef } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Profile } from '../../models/profile.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent {
  userData!: Profile;
  isLoggedIn!: boolean;
  loading: boolean = true;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.checkLoggedInStatus();
    if (this.isLoggedIn) this.getUserData();
    else this.loading = false;
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

  getUserData() {
    this.userService
      .getProfile()
      .pipe(
        tap((data) => {
          this.userData = data;
          this.loading = false;
        }),
        catchError((error) => {
          this.loading = false;
          console.error(error);
          return of(error);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  editWorkExp(id: string): void {
    this.router.navigate(['/profile/work-experience-form', id]);
  }

  deleteWorkExp(id: string): void {
    const confirmed = window.confirm(
      `Are you sure? you want to delete this work experience?`
    );

    if (confirmed) {
      this.userService
        .deleteWorkExperience(id)
        .pipe(
          tap((response) => {
            this.userData.workExperiences =
              this.userData.workExperiences.filter(
                (experience: any) => experience._id !== id
              );
          }),
          catchError((error) => {
            console.error(error);
            return of(error);
          }),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe();
    }
  }

  openForm(): void {
    if (this.isLoggedIn) this.router.navigate(['profile/basic-info-form']);
    else this.router.navigate(['signin']);
  }

  getUserProfilePictureUrl(): string {
    if (this.userData && this.userData.profilePicture) {
      // return `http://localhost:3000/${this.userData.profilePicture}`;
      return `https://profilexpert.onrender.com/${this.userData.profilePicture}`;
    }
    return '';
  }
}
