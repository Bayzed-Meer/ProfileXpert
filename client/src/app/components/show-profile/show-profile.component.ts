import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Profile } from '../../models/profile.model';

@Component({
  selector: 'app-show-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-profile.component.html',
  styleUrl: './show-profile.component.scss',
})
export class ShowProfileComponent {
  @Input() userId!: string;
  userData!: Profile;
  loading: boolean = true;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUserData(this.userId);
  }

  getUserData(userId: string) {
    this.userService.getSharedUserData(userId).subscribe({
      next: (data) => {
        this.userData = data;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        console.error('Error fetching user data:', error);
      },
    });
  }

  getUserProfilePictureUrl(): string {
    if (this.userData && this.userData.profilePicture) {
      // return `http://localhost:3000/${this.userData.profilePicture}`;
      return `https://profilexpert.onrender.com/${this.userData.profilePicture}`;
    }
    return '';
  }
}
