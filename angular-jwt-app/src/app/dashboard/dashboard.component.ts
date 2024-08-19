import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  users: any[] = [];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.apiService.getAllUsers(token).subscribe(
        (data: any) => this.users = data,
        error => alert('Failed to load users')
      );
    } else {
      alert('Unauthorized access');
      this.router.navigate(['/']);
    }
  }

  viewUserDetails(userId: number) {
    this.router.navigate(['/user-details', userId]);
  }

  logout() {
    console.log('Logout called');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
