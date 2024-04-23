import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Profile } from '../../models/profile.model';

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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkLoggedInStatus();
  }

  checkLoggedInStatus(): void {
    this.authService.isLoggedIn().subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      if (this.isLoggedIn) {
        this.getUserData();
      } else this.loading = false;
    });
  }

  getUserData() {
    this.userService.getProfile().subscribe({
      next: (response) => {
        this.loading = false;
        this.userData = response;
      },
      error: (err) => {
        console.error('Error fetching user data:', err);
        this.loading = false;
      },
    });
  }

  editWorkExp(id: string): void {
    this.router.navigate(['/profile/work-experience-form', id]);
  }

  deleteWorkExp(id: string): void {
    const confirmed = window.confirm(
      'Are you sure you want to delete this work experience?'
    );

    if (confirmed) {
      this.userService.deleteWorkExperience(id).subscribe({
        next: (response) => {
          console.log('Work experience deleted', response);
          this.userData.workExperiences = this.userData.workExperiences.filter(
            (experience: any) => experience._id !== id
          );
        },
        error: (err) => {
          console.log('Error deleting work experience', err);
        },
      });
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
