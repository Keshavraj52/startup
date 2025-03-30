import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {

  private apiUrl1 = 'http://localhost:5000/admin';
  private http = inject(HttpClient);


  adminsignup(data: any): Observable<any> {  // ✅ Ensure this returns an Observable
    return this.http.post(`${this.apiUrl1}/signup`, data);
  }

  adminlogin(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl1}/login`, data);
  }}
