import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { AdminAuthService } from '../services/admin-auth.service';

@Component({
  selector: 'app-admin-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './admin-signup.component.html',
  styleUrl: './admin-signup.component.css'
})
export class AdminSignupComponent {
  signupForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AdminAuthService, private router: Router) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      bloodBankName: ['', Validators.required],
      location: ['', Validators.required],
      contact: ['', Validators.required]
    });
  }

  signup() {
    if (this.signupForm.valid) {
      this.authService.adminsignup(this.signupForm.value).subscribe({  // ✅ Updated method name
        next: () => {
          alert('Signup Successful');
          this.router.navigate(['/admin-login']);
        },
        error: (err: any) => {
          console.error('Signup Error:', err);
          alert('Signup Failed');
        }
      });
    }
  }
}
