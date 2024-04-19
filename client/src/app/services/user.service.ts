import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import { BasicApiResponse } from '../models/basic-api-response.model';
import { Profile } from '../models/profile.model';
import { SharedUser } from '../models/shared-user.model';
import { WorkExperience } from '../models/work-experience.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // private API: string = 'http://localhost:3000';
  private API: string = 'https://profilexpert.onrender.com';
  private userId: string = '';

  constructor(private http: HttpClient) {}

  createProfile(formData: FormData): Observable<BasicApiResponse> {
    this.getUserId();
    return this.http.post<BasicApiResponse>(
      `${this.API}/users/createProfile/${this.userId}`,
      formData
    );
  }

  getProfile(userId?: string): Observable<Profile> {
    this.getUserId();
    const finalId = userId || this.userId;
    return this.http.get<Profile>(`${this.API}/users/getProfile/${finalId}`);
  }

  updateProfile(formData: FormData): Observable<BasicApiResponse> {
    this.getUserId();
    return this.http.patch<BasicApiResponse>(
      `${this.API}/users/updateProfile/${this.userId}`,
      formData
    );
  }

  shareProfile(formData: FormData): Observable<BasicApiResponse> {
    this.getUserId();
    return this.http.post<BasicApiResponse>(
      `${this.API}/users/shareProfile/${this.userId}`,
      formData
    );
  }

  getSharedUser(): Observable<any> {
    this.getUserId();
    return this.http.get<any>(`${this.API}/users/getSharedUser/${this.userId}`);
  }

  addWorkExperience(formData: FormData): Observable<BasicApiResponse> {
    this.getUserId();
    return this.http.post<BasicApiResponse>(
      `${this.API}/users/addWorkExperience/${this.userId}`,
      formData
    );
  }

  getWorkExperience(id: string): Observable<WorkExperience> {
    this.getUserId();
    return this.http.get<WorkExperience>(
      `${this.API}/users/getWorkExperience/${this.userId}/${id}`
    );
  }

  updateWorkExperience(
    formData: FormData,
    id: string
  ): Observable<BasicApiResponse> {
    this.getUserId();
    return this.http.patch<BasicApiResponse>(
      `${this.API}/users/updateWorkExperience/${this.userId}/${id}`,
      formData
    );
  }

  deleteWorkExperience(id: string): Observable<BasicApiResponse> {
    this.getUserId();
    return this.http.delete<BasicApiResponse>(
      `${this.API}/users/deleteWorkExperience/${this.userId}/${id}`
    );
  }

  private getUserId(): void {
    const token = localStorage.getItem('Token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.userId = decodedToken.userId;
    }
  }
}
