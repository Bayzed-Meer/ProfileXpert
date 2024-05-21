import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { AuthResponse } from '../models/auth-response.model';
import { Token } from '../models/token.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API: string = 'http://localhost:3000';
  // private API: string = 'https://profilexpert.onrender.com';
  private isLoggedIn$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  signup(formData: FormData): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API}/auth/signup`, formData)
      .pipe(
        tap((response) => {
          this.setToken(response.token);
          this.isLoggedIn$.next(true);
        })
      );
  }

  signin(formData: FormData): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API}/auth/signin`, formData)
      .pipe(
        tap((response) => {
          this.setToken(response.token);
          this.isLoggedIn$.next(true);
        })
      );
  }

  isLoggedIn(): Observable<boolean> {
    this.checkTokenValidity();
    return this.isLoggedIn$.asObservable();
  }

  private setToken(token: string): void {
    localStorage.setItem('Token', token);
  }

  private getToken(): string | null {
    return localStorage.getItem('Token');
  }

  logout(): void {
    localStorage.removeItem('Token');
    this.isLoggedIn$.next(false);
  }

  private checkTokenValidity(): void {
    const token = this.getToken();
    if (token) {
      const decodedToken: Token = jwtDecode(token);
      const expirationTime = decodedToken.exp * 1000;
      if (Date.now() <= expirationTime) this.isLoggedIn$.next(true);
      else this.logout();
    }
  }
}
