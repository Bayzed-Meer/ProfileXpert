import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
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
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.signin = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(32),
        ],
      ],
    });
  }

  onSubmit() {
    if (this.signin.valid) {
      const formData = { ...this.signin.value };

      this.authService.signin(formData).subscribe({
        next: (response) => {
          console.log('signin successful');
          this.router.navigate(['home']);
        },
        error: (err) => {
          this.errorMessage = err.error.message;
          console.error('signin failed:', err);
        },
      });
    }
  }

  navigate(): void {
    this.router.navigate(['signup']);
  }
}
