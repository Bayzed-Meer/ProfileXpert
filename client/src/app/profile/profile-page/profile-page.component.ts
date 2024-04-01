import { Component } from '@angular/core';
import { UserService } from '../../user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent {
  userData: any;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUserData();
  }

  getUserData() {
    this.userService.getUserData().subscribe(
      (data: any) => {
        this.userData = data;
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }
  getUserProfilePictureUrl(): string {
    if (this.userData && this.userData.profilePicture) {
      return `http://localhost:3000/${this.userData.profilePicture}`;
    }
    return '';
  }
}
