import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

interface AuthResponse {
  message: string;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API: string = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  signup(formData: FormData): Observable<any> {
    return this.http
      .post<AuthResponse>(`${this.API}/auth/signup`, formData)
      .pipe(
        tap((response) => {
          this.setToken(response.token);
        })
      );
  }
  signin(formData: FormData): Observable<any> {
    return this.http
      .post<AuthResponse>(`${this.API}/auth/signin`, formData)
      .pipe(
        tap((response) => {
          this.setToken(response.token);
        })
      );
  }
  setToken(token: string): void {
    localStorage.setItem('Token', token);
  }
  getToken(): string | null {
    return localStorage.getItem('Token');
  }
}
