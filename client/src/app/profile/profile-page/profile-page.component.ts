import { Component, EventEmitter, Output } from '@angular/core';
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
  buttonText: string = 'Create Profile';

  @Output() showForm = new EventEmitter<void>();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUserData();
  }

  showProfileForm() {
    this.showForm.emit();
  }

  getUserData() {
    this.userService.getUserData().subscribe(
      (data: any) => {
        this.userData = data;
        if (this.userData) this.buttonText = 'Edit Details';
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
