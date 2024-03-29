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

  submitProfile(profileData: FormData): Observable<any> {
    this.getUserId();
    return this.http.post<any>(`${this.API}/users/${this.userId}`, profileData);
  }

  private getUserId(): void {
    const token = localStorage.getItem('Token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.userId = decodedToken.userId;
    }
  }
}
