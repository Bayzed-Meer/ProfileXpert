import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/user.service';
import { IndexedDBService } from '../../services/indexed-db.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-basic-info-form',
  templateUrl: './basic-info-form.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./basic-info-form.component.scss'],
})
export class BasicInfoFormComponent implements OnInit {
  profileForm!: FormGroup;
  errorMessage: string = '';

  @Output() formSubmitted = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private indexedDBService: IndexedDBService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      designation: ['', Validators.required],
      profilePicture: [null],
      age: ['', Validators.required],
      profileSummary: ['', Validators.required],
    });

    this.userService.getUserData().subscribe((userData) => {
      if (userData) this.profileForm = this.setProfileData(userData);
    });

    if (navigator.onLine) {
      this.submitOfflineFormData();
    }

    window.addEventListener('online', this.checkOnlineStatus.bind(this));
    window.addEventListener('offline', this.checkOnlineStatus.bind(this));
  }

  private checkOnlineStatus() {
    if (navigator.onLine) {
      this.submitOfflineFormData();
      window.location.reload();
    }
  }

  setProfileData(userData: any): FormGroup {
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

      if (navigator.onLine) {
        this.userService.submitProfile(formData).subscribe({
          next: (response) => {
            console.log('Profile submitted successfully:', response);
            this.router.navigate(['profile']);
          },
          error: (err) => {
            console.error('Error submitting profile:', err);
            this.errorMessage = err.error.errors[0];
          },
        });
      } else {
        const profileData = {
          name: this.profileForm.get('name')!.value,
          age: this.profileForm.get('age')!.value,
          designation: this.profileForm.get('designation')!.value,
          profileSummary: this.profileForm.get('profileSummary')!.value,
          profilePicture: this.profileForm.get('profilePicture')!.value,
        };
        this.indexedDBService.storeProfileData(profileData);
        console.log('Profile data stored in IndexedDB');
        this.router.navigate(['profile']);
      }
    }
  }

  private submitOfflineFormData() {
    this.indexedDBService.getProfileData().subscribe((storedProfileData) => {
      if (storedProfileData && storedProfileData.length > 0) {
        storedProfileData.forEach((data: any) => {
          this.userService.submitProfile(data.profileData).subscribe({
            next: (response) => {
              console.log('Offline Profile submitted successfully:', response);
              this.indexedDBService.clearStoredProfileData().subscribe({
                next: () => {
                  console.log('Offline Profile data cleared after submission.');
                },
                error: (err) => {
                  console.error('Error clearing offline profile data:', err);
                },
              });
            },
            error: (err) => {
              console.error('Error submitting offline profile:', err);
            },
          });
        });
      }
    });
  }

  ngOnDestroy() {
    window.removeEventListener('online', this.checkOnlineStatus.bind(this));
    window.removeEventListener('offline', this.checkOnlineStatus.bind(this));
  }

  onProfilePictureSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.profileForm.get('profilePicture')!.setValue(file);
    }
  }

  markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
