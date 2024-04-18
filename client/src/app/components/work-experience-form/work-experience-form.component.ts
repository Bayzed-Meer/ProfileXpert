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
  workExperienceForm!: FormGroup;
  maxDate: string = '';
  @Input() id!: string;
  workExperience: WorkExperience | undefined;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.workExperienceForm = this.fb.group({
      startDate: [null, Validators.required],
      endDate: [null],
      current: [false],
      jobTitle: ['', Validators.required],
      company: ['', Validators.required],
      jobDescription: ['', Validators.required],
    });
    if (this.id) {
      this.userService.getWorkExperience(this.id).subscribe({
        next: (response) => {
          this.workExperience = response;
          this.workExperienceForm = this.setFormValues(this.workExperience);
        },
        error: (error) => {
          console.error('Error fetching work experience', error);
        },
      });
    }

    this.maxDate = new Date().toISOString().split('T')[0];
  }

  formatDate(dateString: string | null): string | null {
    if (!dateString) {
      return null;
    }
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  setFormValues(workExp: any): FormGroup {
    return this.fb.group({
      startDate: [this.formatDate(workExp.startDate)],
      endDate: [this.formatDate(workExp.endDate)],
      current: [workExp.current],
      jobTitle: [workExp.jobTitle],
      company: [workExp.company],
      jobDescription: [workExp.jobDescription],
    });
  }

  toggleCurrent(): void {
    const currentValue = this.workExperienceForm.get('current')!.value;
    const endDateControl = this.workExperienceForm.get('endDate');

    if (currentValue) {
      endDateControl?.setValue(null);
    }
  }

  onSubmit(): void {
    if (this.workExperienceForm.valid) {
      const formData = this.workExperienceForm.value;
      this.userService.submitProfile(formData).subscribe({
        next: (response) => {
          console.log('Work experience added successfully', response);
          this.workExperienceForm.reset();
          this.router.navigate(['profile']);
        },
        error: (error) => {
          console.error('Error adding work experience', error);
        },
      });
    } else {
      this.markFormGroupTouched(this.workExperienceForm);
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
