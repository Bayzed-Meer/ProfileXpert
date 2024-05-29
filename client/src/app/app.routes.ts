import { Routes } from '@angular/router';

import { SignupComponent } from './components/signup/signup.component';
import { SigninComponent } from './components/signin/signin.component';
import { ShowProfileComponent } from './components/show-profile/show-profile.component';
import { BasicInfoFormComponent } from './components/basic-info-form/basic-info-form.component';
import { WorkExperienceFormComponent } from './components/work-experience-form/work-experience-form.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'profile',
  },
  {
    path: 'profile',
    component: ProfilePageComponent,
  },
  {
    path: 'shared-profile',
    loadComponent: () =>
      import('./components/shared-profile/shared-profile.component').then(
        (m) => m.SharedProfileComponent
      ),
    canActivate: [() => inject(AuthService).isLoggedIn()],
  },
  {
    path: 'viewProfile/:userId',
    loadComponent: () =>
      import('./components/show-profile/show-profile.component').then(
        (m) => m.ShowProfileComponent
      ),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./components/signup/signup.component').then(
        (m) => m.SignupComponent
      ),
  },
  {
    path: 'signin',
    loadComponent: () =>
      import('./components/signin/signin.component').then(
        (m) => m.SigninComponent
      ),
  },
  {
    path: 'profile/basic-info-form',
    loadComponent: () =>
      import('./components/basic-info-form/basic-info-form.component').then(
        (m) => m.BasicInfoFormComponent
      ),
  },
  {
    path: 'profile/work-experience-form',
    loadComponent: () =>
      import(
        './components/work-experience-form/work-experience-form.component'
      ).then((m) => m.WorkExperienceFormComponent),
  },
  {
    path: 'profile/work-experience-form/:id',
    loadComponent: () =>
      import(
        './components/work-experience-form/work-experience-form.component'
      ).then((m) => m.WorkExperienceFormComponent),
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];
