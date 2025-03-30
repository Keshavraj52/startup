import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminAuthService } from '../services/admin-auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AdminAuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.authService.adminlogin(this.loginForm.value).subscribe({
        next: (res: any) => {
          if (res.userType === 'admin') {
            localStorage.setItem('token', res.token);
            localStorage.setItem('userType', res.userType);
            this.router.navigate(['/admin/dashboard']);  // ✅ Redirect admin to dashboard
          } else {
            alert('Access denied! Only admins can login here.');
          }
        },
        error: (err: any) => {
          console.error('Login Error:', err);
          alert('Invalid credentials');
        }
      });
    }
  }
}
