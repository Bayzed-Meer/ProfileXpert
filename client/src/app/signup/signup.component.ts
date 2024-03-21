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
import { confirmPasswordValidator } from '../custom-validators';

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
        validators: confirmPasswordValidator,
      }
    );
  }

  onSubmit() {
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

  navigate(): void {
    this.router.navigate(['signin']);
  }
}
