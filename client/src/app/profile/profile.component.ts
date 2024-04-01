import { Component } from '@angular/core';
import { ProfileFormComponent } from './profile-form/profile-form.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ProfileFormComponent, ProfilePageComponent, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  displayProfilePage: boolean = true;

  toggleDisplay() {
    this.displayProfilePage = !this.displayProfilePage;
  }

  handleFormSubmitted() {
    this.displayProfilePage = true;
  }
}
