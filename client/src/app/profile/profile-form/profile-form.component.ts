import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./profile-form.component.scss'],
})
export class ProfileFormComponent implements OnInit {
  profileForm!: FormGroup;

  @Output() formSubmitted = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUserData().subscribe((userData) => {
      this.profileForm = this.createProfileForm(userData);
    });
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

  createProfileForm(userData: any): FormGroup {
    return this.fb.group({
      name: [userData.name],
      age: [userData.age],
      profilePicture: [userData.profilePicture],
      workExperiences: this.fb.array(
        userData.workExperiences.map((workExp: any) => {
          return this.fb.group({
            startDate: [workExp.startDate],
            endDate: [workExp.endDate],
            current: [workExp.current],
            jobTitle: [workExp.jobTitle],
            company: [workExp.company],
            jobDescription: [workExp.jobDescription],
          });
        })
      ),
    });
  }

  addWorkExperience() {
    this.workExperiences.push(
      this.fb.group({
        startDate: [''],
        endDate: [''],
        current: [false],
        jobTitle: [''],
        company: [''],
        jobDescription: [''],
      })
    );
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const formData = new FormData();

      formData.append('name', this.profileForm.get('name')!.value);
      formData.append('age', this.profileForm.get('age')!.value);

      const profilePicture = this.profileForm.get('profilePicture')!.value;
      if (profilePicture instanceof File) {
        formData.append('profilePicture', profilePicture);
      }

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
      });

      this.userService.submitProfile(formData).subscribe({
        next: (response) => {
          console.log('Profile submitted successfully:', response);
          this.formSubmitted.emit();
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
}
