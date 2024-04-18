import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent {
  userData: any;
  isLoggedIn!: boolean;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
    if (this.isLoggedIn) this.getUserData();
  }

  getUserData() {
    this.userService.getUserData().subscribe({
      next: (data: any) => {
        this.userData = data;
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      },
    });
  }

  openForm(): void {
    if (this.isLoggedIn) this.router.navigate(['basic-info-form']);
    else this.router.navigate(['signin']);
  }

  editWorkExp(id: string): void {
    this.router.navigate(['/profile/work-experience-form', id]);
  }

  deleteWorkExp(id: string): void {
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

  getUserProfilePictureUrl(): string {
    if (this.userData && this.userData.profilePicture) {
      return `http://localhost:3000/${this.userData.profilePicture}`;
    }
    return '';
  }
}
