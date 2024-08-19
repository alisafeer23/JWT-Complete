import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls:['./register.component.css']
})
export class RegisterComponent {
  username: string | undefined;
  password: string | undefined;

  register() {
    console.log('User Registered:', this.username);
  }
}
