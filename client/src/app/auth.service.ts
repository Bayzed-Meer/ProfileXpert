import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API: string = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  signup(formData: FormData): Observable<any> {
    return this.http.post(`${this.API}/auth/signup`, formData);
  }
}
