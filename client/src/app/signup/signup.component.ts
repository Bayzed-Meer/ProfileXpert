import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { passwordMatchValidator } from '../custom-validators';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit {
  signup!: FormGroup;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.signup = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(32),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/
            ),
          ],
        ],
        confirmPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(32),
          ],
        ],
      },
      {
        validators: passwordMatchValidator,
      }
    );
  }

  onSubmit() {
    this.markFormGroupTouched(this.signup);
    if (this.signup.valid) {
      const formData = { ...this.signup.value };

      delete formData.confirmPassword;

      this.authService.signup(formData).subscribe({
        next: (response) => {
          console.log('signup successful');
          this.router.navigate(['home']);
        },
        error: (err) => {
          this.errorMessage = err.error.message;
          console.error('Signup failed:', err);
        },
      });
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  navigate(): void {
    this.router.navigate(['signin']);
  }
}
