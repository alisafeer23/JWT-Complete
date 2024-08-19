// src/app/components/login/login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    const credentials = { username: this.username, password: this.password };
    this.authService.login(credentials).subscribe(response => {
      localStorage.setItem('token', response.token);
      this.router.navigate(['dashboard']);
    }, error => {
      alert('Invalid credentials');
    });
  }
}
