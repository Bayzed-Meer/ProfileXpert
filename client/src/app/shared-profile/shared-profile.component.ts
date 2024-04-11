import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shared-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './shared-profile.component.html',
  styleUrl: './shared-profile.component.scss',
})
export class SharedProfileComponent {
  shareForm!: FormGroup;

  constructor(private userService: UserService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.shareForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
    });
  }

  onSubmit(): void {
    if (this.shareForm.valid) {
      const formData = this.shareForm.value;
      this.userService.shareProfile(formData).subscribe({
        next: (response) => {
          console.log('Profile share successful', response);
        },
        error: (error) => {
          console.log('Error sharing profile', error);
        },
      });
    }
  }
}
