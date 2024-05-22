import { Component, DestroyRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
})
export class SigninComponent {
  signin!: FormGroup;
  errorMessage: string = '';
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
    this.signin = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.markFormGroupTouched(this.signin);
    if (this.signin.valid) {
      this.loading = true;
      const formData = { ...this.signin.value };

      this.authService
        .signin(formData)
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
    this.router.navigate(['signup']);
  }
}
