import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shared-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './shared-profile.component.html',
  styleUrl: './shared-profile.component.scss',
})
export class SharedProfileComponent {
  shareForm!: FormGroup;
  sharedUser: any[] = [];
  errorMessage!: string;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.shareForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
    });

    this.userService.getSharedUser().subscribe({
      next: (response) => {
        this.sharedUser = response;
        console.log('Shared User Data fetching successful', this.sharedUser);
      },
      error: (error) => {
        console.log('Error fetching shared UserData', error);
      },
    });
  }

  onViewProfile(userId: string): void {
    this.router.navigate(['/viewProfile', userId]);
  }

  onSubmit(): void {
    if (this.shareForm.valid) {
      const formData = this.shareForm.value;
      this.userService.shareProfile(formData).subscribe({
        next: (response) => {
          console.log('Profile share successful', response);
          this.shareForm.reset();
          window.alert('Profile shared successfully');
        },
        error: (error) => {
          this.errorMessage = error.error.message;
          console.log('Error sharing profile', error);
        },
      });
    }
  }
}
