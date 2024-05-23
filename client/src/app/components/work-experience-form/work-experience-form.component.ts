import { Component, DestroyRef, Input, OnInit } from '@angular/core';
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
import { catchError, of, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  loading: boolean = false;
  title: string = 'Add Work Experience';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.initializeMaxDate();
    if (this.id) {
      this.fetchWorkExperienceData();
      this.title = 'Update Work Experience';
    }
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
    this.userService
      .getWorkExperience(this.id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((workExp: WorkExperience) => {
          this.workExperience = workExp;
          this.workExperienceForm = this.fillworkExperienceForm(
            this.workExperience
          );
        }),
        catchError((error) => {
          console.error(error);
          return of(error);
        })
      )
      .subscribe();
  }

  formatDate(dateString: string | null): string | null {
    if (!dateString) {
      return null;
    }
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  toggleCurrent(): void {
    const currentValue = this.workExperienceForm.get('current')?.value;
    const endDateControl = this.workExperienceForm.get('endDate');
    if (currentValue) {
      endDateControl?.setValue(null);
      endDateControl?.clearValidators();
      endDateControl?.updateValueAndValidity();
    } else endDateControl?.setValidators(Validators.required);
  }

  onSubmit(): void {
    this.markFormGroupTouched(this.workExperienceForm);

    if (this.workExperienceForm.valid) {
      this.loading = true;
      const formData = { ...this.workExperienceForm.value };

      if (this.id) {
        this.userService
          .updateWorkExperience(formData, this.id)
          .pipe(
            takeUntilDestroyed(this.destroyRef),
            tap((response) => {
              this.loading = false;
              this.workExperienceForm.reset();
              this.router.navigate(['profile']);
            }),
            catchError((error) => {
              console.error(error);
              return of(error);
            })
          )
          .subscribe();
      } else {
        this.userService
          .addWorkExperience(formData)
          .pipe(
            takeUntilDestroyed(this.destroyRef),
            tap((response) => {
              this.loading = false;
              this.workExperienceForm.reset();
              this.router.navigate(['profile']);
            }),
            catchError((error) => {
              this.loading = false;
              console.error(error);
              return of(error);
            })
          )
          .subscribe();
      }
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
