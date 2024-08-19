import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private apiService: ApiService, private router: Router) {}

  onLogin() {
    const credentials = { username: this.username, password: this.password };
    this.apiService.generateToken(credentials).subscribe(
      (response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token); // Save token in local storage
          this.router.navigate(['/dashboard']); // Navigate to dashboard
        } else {
          alert('Token not received');
        }
      },
      error => {
        alert(error.error);
      }
    );
  }
}
