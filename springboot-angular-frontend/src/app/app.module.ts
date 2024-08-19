import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { AllUsersComponent } from './components/all-users/all-users.component';
import { FruitsComponent } from './components/fruits/fruits.component';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'user-details', component: UserDetailsComponent },
  { path: 'all-users', component: AllUsersComponent },
  { path: 'fruits', component: FruitsComponent },
  { path: '', redirectTo: '/register', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    UserDetailsComponent,
    AllUsersComponent,
    FruitsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
