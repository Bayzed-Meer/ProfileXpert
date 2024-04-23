import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

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
    private authService: AuthService
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
      const formData = { ...this.signin.value };

      this.loading = true;

      this.authService.signin(formData).subscribe({
        next: (response) => {
          console.log('signin successful', response);
          this.loading = false;
          this.router.navigate(['profile']);
        },
        error: (err) => {
          this.errorMessage = err.error.message;
          console.error('signin failed:', err);
          this.loading = false;
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
    this.router.navigate(['signup']);
  }
}
