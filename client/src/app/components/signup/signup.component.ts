import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { passwordMatchValidator } from '../../custom-validators/password-match-validator';
import { catchError, of, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit {
  signup!: FormGroup;
  errorMessage!: string;
  loading: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm(): void {
    this.signup = this.formBuilder.group(
      {
        username: ['', Validators.required],
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
        validators: passwordMatchValidator(),
      }
    );
  }

  onSubmit() {
    this.markFormGroupTouched(this.signup);
    if (this.signup.valid) {
      this.loading = true;
      const formData = { ...this.signup.value };
      delete formData.confirmPassword;

      this.authService
        .signup(formData)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          tap((response) => {
            this.loading = false;
            this.router.navigate(['profile']);
          }),
          catchError((error) => {
            this.loading = false;
            this.errorMessage = error.error.message;
            return of(error);
          })
        )
        .subscribe();
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
