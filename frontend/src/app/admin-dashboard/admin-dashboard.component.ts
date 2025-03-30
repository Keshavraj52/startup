import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  adminData: any = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.checkAdminAuth(); // ✅ Ensure only logged-in admins can access
    this.fetchAdminDetails();
  }

  checkAdminAuth() {
    const userType = localStorage.getItem('userType');
    if (userType !== 'admin') {
      alert('Access denied! Please log in as an admin.');
      this.router.navigate(['/admin/login']); // ✅ Redirect to admin login if not an admin
    }
  }

  fetchAdminDetails() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Session expired. Please login again.');
      this.router.navigate(['/admin-login']);
      return;
    }

    this.http.get<any>('http://localhost:5000/admin/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (data) => {
        this.adminData = data; // ✅ Store admin details
      },
      error: (err) => {
        console.error('Error fetching admin details:', err);
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userType'); // ✅ Clear session
    this.router.navigate(['/admin/login']); // ✅ Redirect to admin login
  }
}
