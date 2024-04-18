import { Routes } from '@angular/router';

import { SignupComponent } from './components/signup/signup.component';
import { SigninComponent } from './components/signin/signin.component';
import { ShowProfileComponent } from './components/show-profile/show-profile.component';
import { BasicInfoFormComponent } from './components/basic-info-form/basic-info-form.component';
import { WorkExperienceFormComponent } from './components/work-experience-form/work-experience-form.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';

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
  },
  { path: 'viewProfile/:userId', component: ShowProfileComponent },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'signin',
    component: SigninComponent,
  },
  {
    path: 'profile/basic-info-form',
    component: BasicInfoFormComponent,
  },
  {
    path: 'profile/work-experience-form',
    component: WorkExperienceFormComponent,
  },
  {
    path: 'profile/work-experience-form/:id',
    component: WorkExperienceFormComponent,
  },
];
