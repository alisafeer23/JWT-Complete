import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  username = '';
  email = '';
  password = '';
  dob = '';
  address = '';
  contact = '';
  city = '';
  area = '';

  constructor(private apiService: ApiService, private router: Router, private authService: AuthService) {}

  onRegister() {
    if (!this.dob) {
      alert('Date of Birth is required');
      return;
    }

    const formattedDob = formatDate(this.dob, 'yyyy-MM-dd', 'en-US');

    const user = {
      username: this.username,
      email: this.email,
      password: this.password,
      dob: formattedDob,
      address: this.address,
      contact: this.contact,
      city: this.city,
      area: this.area
    };

    this.apiService.register(user).subscribe(
      (response) => {
        console.log('Registration success:', response);
        if (response && response.status === 'success') {
          alert(response.message || 'User registered successfully');
          this.router.navigate(['/']);
        } else {
          alert('Unexpected success response: ' + JSON.stringify(response));
        }
      },
      error => {
        console.error('Registration error:', error);
        if (error.status === 401) {
          this.authService.logout(); // Clear session and redirect
          alert('Session expired. Please log in again.');
        } else {
          let errorMessage = 'Registration failed: ';
          if (error.error && typeof error.error === 'object' && Object.keys(error.error).length > 0) {
            errorMessage += JSON.stringify(error.error);
          } else if (error.message) {
            errorMessage += error.message;
          } else {
            errorMessage += 'Unknown error occurred';
          }
          alert(errorMessage);
        }
      }
    );
  }
}
