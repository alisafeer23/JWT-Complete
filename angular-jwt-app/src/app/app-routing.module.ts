import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterComponent } from './register/register.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { FruitsComponent } from './fruits/fruits.component';
import { SomeComponent } from './some-component/some-component.component';
import { AuthGuard } from './auth.guard'; // Import the AuthGuard

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] }, // Protect this route with AuthGuard
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },  // Protect this route with AuthGuard
  { path: 'user-details/:id', component: UserDetailsComponent, canActivate: [AuthGuard] },  // Protect this route with AuthGuard
  { path: 'fruits', component: FruitsComponent, canActivate: [AuthGuard] },  // Protect this route with AuthGuard
  { path: 'some-component', component: SomeComponent, canActivate: [AuthGuard] },  // Protect this route with AuthGuard
  // Add other routes as needed
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
