import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html'
})
export class UserDetailsComponent implements OnInit {

  userDetails: any;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const userId = this.route.snapshot.paramMap.get('id');
    if (token && userId) {
      this.apiService.getUserDetails(Number(userId), token).subscribe(
        (data: any) => this.userDetails = data,
        error => {
          alert('Failed to load user details');
          this.router.navigate(['/dashboard']);
        }
      );
    } else {
      alert('Unauthorized access');
      this.router.navigate(['/']);
    }
  }
}
