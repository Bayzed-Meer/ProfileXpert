import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface AuthResponse {
  message: string;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API: string = 'http://localhost:3000';
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.checkTokenValidity();
  }

  signup(formData: FormData): Observable<any> {
    return this.http
      .post<AuthResponse>(`${this.API}/auth/signup`, formData)
      .pipe(
        tap((response) => {
          this.setToken(response.token);
          this.isLoggedInSubject.next(true);
        })
      );
  }

  signin(formData: FormData): Observable<any> {
    return this.http
      .post<AuthResponse>(`${this.API}/auth/signin`, formData)
      .pipe(
        tap((response) => {
          this.setToken(response.token);
          this.isLoggedInSubject.next(true);
        })
      );
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  private setToken(token: string): void {
    localStorage.setItem('Token', token);
  }

  private getToken(): string | null {
    return localStorage.getItem('Token');
  }

  logout(): void {
    localStorage.removeItem('Token');
    this.isLoggedInSubject.next(false);
  }

  private checkTokenValidity(): void {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);

      const expirationTime = decodedToken.exp * 1000;
      if (Date.now() <= expirationTime) {
        this.isLoggedInSubject.next(true);
      } else {
        this.logout();
      }
    }
  }
}
