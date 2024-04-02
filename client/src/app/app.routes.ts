import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuardService } from './auth-guard.service';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuardService],
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
