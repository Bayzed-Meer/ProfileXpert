import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private API: string = 'http://localhost:3000';
  private userId: string = '';

  constructor(private http: HttpClient) {}

  createProfile(formData: FormData): Observable<any> {
    this.getUserId();
    return this.http.post<any>(
      `${this.API}/users/createProfile/${this.userId}`,
      formData
    );
  }

  getProfile(userId?: string): Observable<any> {
    this.getUserId();
    const finalId = userId || this.userId;
    return this.http.get<any>(`${this.API}/users/getProfile/${finalId}`);
  }

  updateProfile(formData: FormData): Observable<any> {
    this.getUserId();
    return this.http.patch<any>(
      `${this.API}/users/updateProfile/${this.userId}`,
      formData
    );
  }

  shareProfile(formData: FormData): Observable<any> {
    this.getUserId();
    return this.http.post<any>(
      `${this.API}/users/shareProfile/${this.userId}`,
      formData
    );
  }

  getSharedUser(): Observable<any> {
    this.getUserId();
    return this.http.get<any>(`${this.API}/users/getSharedUser/${this.userId}`);
  }

  addWorkExperience(formData: FormData): Observable<any> {
    this.getUserId();
    return this.http.post<any>(
      `${this.API}/users/addWorkExperience/${this.userId}`,
      formData
    );
  }

  getWorkExperience(id: string): Observable<any> {
    this.getUserId();
    return this.http.get<any>(
      `${this.API}/users/getWorkExperience/${this.userId}/${id}`
    );
  }

  updateWorkExperience(formData: FormData, id: string): Observable<any> {
    this.getUserId();
    return this.http.patch<any>(
      `${this.API}/users/updateWorkExperience/${this.userId}/${id}`,
      formData
    );
  }

  deleteWorkExperience(id: string): Observable<any> {
    this.getUserId();
    return this.http.delete<any>(
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
