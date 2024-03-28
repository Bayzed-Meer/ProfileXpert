import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: [''],
      profilePicture: [null],
      age: [''],
      workExperiences: this.fb.array([]),
    });
  }

  get workExperiences(): FormArray {
    return this.profileForm.get('workExperiences') as FormArray;
  }

  addWorkExperience() {
    this.workExperiences.push(
      this.fb.group({
        startDate: [''],
        endDate: [''],
        current: [false],
        jobTitle: [''],
        company: [''],
        companyLogo: [null],
        jobDescription: [''],
      })
    );
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const formData = new FormData();

      formData.append('name', this.profileForm.get('name')!.value);
      formData.append('age', this.profileForm.get('age')!.value);
      formData.append(
        'profilePicture',
        this.profileForm.get('profilePicture')!.value
      );

      const workExperiences = this.profileForm.get(
        'workExperiences'
      ) as FormArray;
      workExperiences.controls.forEach((control, index) => {
        formData.append(
          `workExperiences[${index}][startDate]`,
          control.get('startDate')!.value
        );
        formData.append(
          `workExperiences[${index}][endDate]`,
          control.get('endDate')!.value
        );
        formData.append(
          `workExperiences[${index}][current]`,
          control.get('current')!.value ? 'true' : 'false'
        );
        formData.append(
          `workExperiences[${index}][jobTitle]`,
          control.get('jobTitle')!.value
        );
        formData.append(
          `workExperiences[${index}][company]`,
          control.get('company')!.value
        );
        formData.append(
          `workExperiences[${index}][jobDescription]`,
          control.get('jobDescription')!.value
        );
        const companyLogo = control.get('companyLogo')!.value;
        if (companyLogo instanceof File) {
          formData.append(
            `workExperiences[${index}][companyLogo]`,
            companyLogo
          );
        }
      });

      this.userService.submitProfile(formData).subscribe({
        next: (response) => {
          console.log('Profile submitted successfully:', response);
        },
        error: (error) => {
          console.error('Error submitting profile:', error);
        },
      });
    }
  }

  removeWorkExperience(index: number) {
    this.workExperiences.removeAt(index);
  }

  onProfilePictureSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.profileForm.get('profilePicture')!.setValue(file);
    }
  }

  onCompanyLogoSelected(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      const control = this.workExperiences.at(index) as FormGroup;
      control.get('companyLogo')!.setValue(file);
    }
  }
}
