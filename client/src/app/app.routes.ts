import { Routes } from '@angular/router';

import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { ProfileComponent } from './profile/profile.component';
import { Component } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'profile',
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'shared-profile',
    loadComponent: () =>
      import('./shared-profile/shared-profile.component').then(
        (m) => m.SharedProfileComponent
      ),
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'signin',
    component: SigninComponent,
  },
];
