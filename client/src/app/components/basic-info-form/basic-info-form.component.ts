import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { ageValidator } from '../../custom-validators/age-validator';
import { BasicInfo } from '../../models/basic-Info.model';

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

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private indexedDBService: IndexedDBService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.fetchProfileData();
    this.setupOfflineFormSubmissionListeners();
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
    this.userService.getProfile().subscribe((response) => {
      if (response) {
        this.profileData = response;
        this.profileForm = this.fillProfileForm(this.profileData);
        this.newUser = false;
      }
    });
  }

  fillProfileForm(userData: any): FormGroup {
    return this.fb.group({
      name: [userData.name],
      age: [userData.age],
      designation: [userData.designation],
      profilePicture: [userData.profilePicture],
      profileSummary: [userData.profileSummary],
    });
  }

  setupOfflineFormSubmissionListeners(): void {
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

      if (navigator.onLine) {
        if (this.newUser) {
          this.userService.createProfile(formData).subscribe({
            next: (response) => {
              console.log('Profile created successfully:', response);
              this.loading = false;
              this.router.navigate(['profile']);
            },
            error: (err) => {
              console.error('Error creating profile:', err);
              this.loading = false;
            },
          });
        } else {
          this.userService.updateProfile(formData).subscribe({
            next: (response) => {
              console.log('Profile updated successfully:', response);
              this.loading = false;
              this.router.navigate(['profile']);
            },
            error: (err) => {
              console.error('Error updating profile:', err);
              this.loading = false;
            },
          });
        }
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
        this.loading = false;
        this.router.navigate(['profile']);
      }
    }
  }

  private submitOfflineFormData() {
    this.indexedDBService.getProfileData().subscribe((storedProfileData) => {
      if (storedProfileData && storedProfileData.length > 0) {
        storedProfileData.forEach((data: any) => {
          if (this.newUser) {
            this.userService.createProfile(data.profileData).subscribe({
              next: (response) => {
                console.log('Offline Profile created successfully:', response);
                this.indexedDBService.clearStoredProfileData().subscribe({
                  next: () => {
                    console.log('Offline Profile data cleared after creation.');
                  },
                  error: (err) => {
                    console.error('Error clearing offline profile data:', err);
                  },
                });
              },
              error: (err) => {
                console.error('Error creating offline profile:', err);
              },
            });
          } else {
            this.userService.updateProfile(data.profileData).subscribe({
              next: (response) => {
                console.log('Offline Profile updated successfully:', response);
                this.indexedDBService.clearStoredProfileData().subscribe({
                  next: () => {
                    console.log('Offline Profile data cleared after update.');
                  },
                  error: (err) => {
                    console.error('Error clearing offline profile data:', err);
                  },
                });
              },
              error: (err) => {
                console.error('Error updating offline profile:', err);
              },
            });
          }
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
