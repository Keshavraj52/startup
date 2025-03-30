import { Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminSignupComponent } from './admin-signup/admin-signup.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UserBbListComponent } from './user-bb-list/user-bb-list.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    {path:'signup',component:SignupComponent},
    {path:'login',component:LoginComponent},
    {path:'dashboard',component:DashboardComponent,canActivate:[AuthGuard]},
    // { path: '**', redirectTo: 'login' },
    { path: 'admin/signup', component: AdminSignupComponent },
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: 'bloodbanks', component: UserBbListComponent },
  { path: '', redirectTo: '/bloodbanks', pathMatch: 'full' },
  {path:'bblist',component:UserBbListComponent}
  


];
