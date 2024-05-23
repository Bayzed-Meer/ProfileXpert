import { Component, DestroyRef, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SharedUser } from '../../models/shared-user.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-shared-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './shared-profile.component.html',
  styleUrl: './shared-profile.component.scss',
})
export class SharedProfileComponent implements OnInit {
  shareForm!: FormGroup;
  sharedUsers: SharedUser[] = [];
  errorMessage!: string;
  loading: boolean = false;
  loadingShare: boolean = false;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.fetchSharedUserData();
  }

  initializeForm(): void {
    this.shareForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
    });
  }

  fetchSharedUserData(): void {
    this.loading = true;
    this.userService
      .getSharedUser()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((response) => {
          this.loading = false;
          this.sharedUsers = response;
        }),
        catchError((error) => {
          this.loading = false;
          console.error(error);
          return of(error);
        })
      )
      .subscribe();
  }

  onViewProfile(userId: string): void {
    this.router.navigate(['/viewProfile', userId]);
  }

  onSubmit(): void {
    if (this.shareForm.valid) {
      this.loadingShare = true;
      const formData = this.shareForm.value;
      this.userService
        .shareProfile(formData)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          tap((response) => {
            this.shareForm.reset();
            this.loadingShare = false;
            window.alert('Profile shared successfully');
          }),
          catchError((error) => {
            this.loadingShare = false;
            this.errorMessage = error.error.message;
            console.log(error);
            return of(error);
          })
        )
        .subscribe();
    }
  }
}
