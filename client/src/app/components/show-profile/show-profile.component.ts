import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-show-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-profile.component.html',
  styleUrl: './show-profile.component.scss',
})
export class ShowProfileComponent {
  @Input() userId!: string;
  userData: any;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUserData(this.userId);
  }

  getUserData(userId: string) {
    this.userService.getUserData(userId).subscribe({
      next: (data: any) => {
        this.userData = data;
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
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
