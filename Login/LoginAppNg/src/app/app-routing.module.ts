import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth/auth.guard';
import { AnonymousGuard } from './auth/anonymous.guard';
import { AdminComponent } from './admin/admin.component';
const routes: Routes = [
{ path: '', redirectTo: '/Register', pathMatch: 'full' },
{ path: 'Login', component: LoginComponent, canActivate:[AnonymousGuard] },
{ path: 'Register', component: RegisterComponent , canActivate:[AnonymousGuard]},
{ path: 'Dashboard', component: DashboardComponent, canActivate:[AuthGuard] },
{ path: 'Admin', component: AdminComponent, canActivate:[AuthGuard] },
 { path: '**', component: RegisterComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const RoutingComponents = [HeaderComponent, RegisterComponent, LoginComponent, DashboardComponent, AdminComponent]; 