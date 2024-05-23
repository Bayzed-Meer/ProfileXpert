import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BasicApiResponse } from '../models/basic-api-response.model';
import { Profile } from '../models/profile.model';
import { SharedUser } from '../models/shared-user.model';
import { WorkExperience } from '../models/work-experience.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private API: string = 'http://localhost:3000';
  // private API: string = 'https://profilexpert.onrender.com';

  constructor(private http: HttpClient) {}

  createProfile(formData: FormData): Observable<BasicApiResponse> {
    return this.http.post<BasicApiResponse>(
      `${this.API}/users/createProfile`,
      formData
    );
  }

  getProfile(): Observable<Profile> {
    return this.http.get<Profile>(`${this.API}/users/getProfile`);
  }

  updateProfile(formData: FormData): Observable<BasicApiResponse> {
    return this.http.patch<BasicApiResponse>(
      `${this.API}/users/updateProfile`,
      formData
    );
  }

  shareProfile(formData: FormData): Observable<BasicApiResponse> {
    return this.http.post<BasicApiResponse>(
      `${this.API}/users/shareProfile`,
      formData
    );
  }

  getSharedUser(): Observable<any> {
    return this.http.get<any>(`${this.API}/users/getSharedUser`);
  }

  getSharedUserData(userId: string): Observable<Profile> {
    return this.http.get<Profile>(
      `${this.API}/users/getSharedUserData/${userId}`
    );
  }

  addWorkExperience(formData: FormData): Observable<BasicApiResponse> {
    return this.http.post<BasicApiResponse>(
      `${this.API}/users/addWorkExperience`,
      formData
    );
  }

  getWorkExperience(id: string): Observable<WorkExperience> {
    return this.http.get<WorkExperience>(
      `${this.API}/users/getWorkExperience/${id}`
    );
  }

  updateWorkExperience(
    formData: FormData,
    id: string
  ): Observable<BasicApiResponse> {
    return this.http.patch<BasicApiResponse>(
      `${this.API}/users/updateWorkExperience/${id}`,
      formData
    );
  }

  deleteWorkExperience(id: string): Observable<BasicApiResponse> {
    return this.http.delete<BasicApiResponse>(
      `${this.API}/users/deleteWorkExperience/${id}`
    );
  }
}
