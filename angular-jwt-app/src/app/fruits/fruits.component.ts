import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fruits',
  templateUrl: './fruits.component.html'
})
export class FruitsComponent implements OnInit {

  fruits: string[] = [];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.apiService.getAllFruits(token).subscribe(
        (data: any) => this.fruits = data,
        error => alert('Failed to load fruits')
      );
    } else {
      alert('Unauthorized access');
      this.router.navigate(['/']);
    }
  }
}
