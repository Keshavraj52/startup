import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  user = localStorage.getItem('token') ? 'Authenticated User' : 'Guest';

  logout() {
    localStorage.removeItem('token');
    alert('Logged out successfully!');
    window.location.href = '/login'; // Redirect to login
  }
}
