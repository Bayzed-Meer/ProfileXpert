import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { ageValidator } from '../../custom-validators/age-validator';
import { BasicInfo } from '../../models/basic-Info.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-basic-info-form',
  templateUrl: './basic-info-form.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./basic-info-form.component.scss'],
})
export class BasicInfoFormComponent implements OnInit {
  profileForm!: FormGroup;
  profileData!: BasicInfo;
  newUser: boolean = true;
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.fetchProfileData();
  }

  initializeForm(): void {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      designation: ['', Validators.required],
      profilePicture: [null],
      age: ['', [Validators.required, ageValidator()]],
      profileSummary: ['', Validators.required],
    });
  }

  fetchProfileData(): void {
    this.userService
      .getProfile()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((userData) => {
          if (userData) {
            this.profileData = userData;
            this.profileForm = this.fillProfileForm(this.profileData);
            this.newUser = false;
          }
        }),
        catchError((error) => {
          console.error('error', error);
          return of(error);
        })
      )
      .subscribe();
  }

  fillProfileForm(userData: BasicInfo): FormGroup {
    return this.fb.group({
      name: [userData.name],
      age: [userData.age],
      designation: [userData.designation],
      profilePicture: [userData.profilePicture],
      profileSummary: [userData.profileSummary],
    });
  }

  onSubmit() {
    this.markFormGroupTouched(this.profileForm);

    if (this.profileForm.valid) {
      this.loading = true;

      const formData = new FormData();

      formData.append('name', this.profileForm.get('name')!.value);
      formData.append('age', this.profileForm.get('age')!.value);
      formData.append(
        'designation',
        this.profileForm.get('designation')!.value
      );
      formData.append(
        'profileSummary',
        this.profileForm.get('profileSummary')!.value
      );

      const profilePicture = this.profileForm.get('profilePicture')!.value;
      if (profilePicture instanceof File) {
        formData.append('profilePicture', profilePicture);
      }

      if (this.newUser) {
        this.userService
          .createProfile(formData)
          .pipe(
            takeUntilDestroyed(this.destroyRef),
            tap((response) => {
              this.loading = false;
              this.router.navigate(['profile']);
            }),
            catchError((error) => {
              this.loading = false;
              console.error(error);
              this.errorMessage = error.error.errors.age;
              return of(error);
            })
          )
          .subscribe();
      } else {
        this.userService
          .updateProfile(formData)
          .pipe(
            takeUntilDestroyed(this.destroyRef),
            tap((response) => {
              this.loading = false;
              this.router.navigate(['profile']);
            }),
            catchError((error) => {
              this.loading = false;
              console.error(error);
              this.errorMessage = error.error.errors.age;
              return of(error);
            })
          )
          .subscribe();
      }
    }
  }

  onProfilePictureSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.profileForm.get('profilePicture')!.setValue(file);
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
}
