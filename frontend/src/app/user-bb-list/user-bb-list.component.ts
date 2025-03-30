import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-user-bb-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-bb-list.component.html',
  styleUrl: './user-bb-list.component.css'
})
export class UserBbListComponent {
  bloodBanks: any[] = []; // Stores the list of blood banks

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchBloodBanks();
  }

  fetchBloodBanks() {
    this.http.get<any[]>('http://localhost:5000/bloodbanks') // ✅ Ensure this matches your backend API
      .subscribe({
        next: (data) => {
          this.bloodBanks = data; // ✅ Store response data in bloodBanks array
        },
        error: (err) => {
          console.error('Error fetching blood banks:', err);
        }
      });
  }
}
