import { Component, Input, OnInit } from '@angular/core';
import { WorkExperience } from '../../models/work-experience.model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-work-experience-form',
  templateUrl: './work-experience-form.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./work-experience-form.component.scss'],
})
export class WorkExperienceFormComponent implements OnInit {
  @Input() id!: string;
  maxDate: string = '';
  workExperienceForm!: FormGroup;
  workExperience!: WorkExperience;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.initializeMaxDate();
    if (this.id) this.fetchWorkExperienceData();
  }

  initializeForm(): void {
    this.workExperienceForm = this.fb.group({
      startDate: [null, Validators.required],
      endDate: [null],
      current: [false],
      jobTitle: ['', Validators.required],
      company: ['', Validators.required],
      jobDescription: ['', Validators.required],
    });
  }

  initializeMaxDate(): void {
    this.maxDate = new Date().toISOString().split('T')[0];
  }

  fillworkExperienceForm(workExp: any): FormGroup {
    return this.fb.group({
      startDate: [this.formatDate(workExp.startDate)],
      endDate: [this.formatDate(workExp.endDate)],
      current: [workExp.current],
      jobTitle: [workExp.jobTitle],
      company: [workExp.company],
      jobDescription: [workExp.jobDescription],
    });
  }

  fetchWorkExperienceData(): void {
    this.userService.getWorkExperience(this.id).subscribe({
      next: (response) => {
        this.workExperience = response;
        this.workExperienceForm = this.fillworkExperienceForm(
          this.workExperience
        );
      },
      error: (err) => {
        console.error('Error fetching work experience', err);
      },
    });
  }

  formatDate(dateString: string | null): string | null {
    if (!dateString) {
      return null;
    }
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  toggleCurrent(): void {
    const currentValue = this.workExperienceForm.get('current')!.value;
    const endDateControl = this.workExperienceForm.get('endDate');

    if (currentValue) {
      endDateControl?.setValue(null);
    }
  }

  onSubmit(): void {
    this.markFormGroupTouched(this.workExperienceForm);

    if (this.workExperienceForm.valid) {
      const formData = this.workExperienceForm.value;

      if (!this.id) {
        this.userService.addWorkExperience(formData).subscribe({
          next: (response) => {
            console.log('Work experience added successfully', response);
            this.workExperienceForm.reset();
            this.router.navigate(['profile']);
          },
          error: (err) => {
            console.error('Error adding work experience', err);
          },
        });
      } else {
        this.userService.updateWorkExperience(formData, this.id).subscribe({
          next: (response) => {
            console.log('Work experience added successfully', response);
            this.workExperienceForm.reset();
            this.router.navigate(['profile']);
          },
          error: (err) => {
            console.error('Error adding work experience', err);
          },
        });
      }
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
