import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot , Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private _router: Router  , private _authservice : AuthService) {}
  canActivate(route : ActivatedRouteSnapshot , state: RouterStateSnapshot): boolean {
    if (!this._authservice.isAuthenticated()) {
      this._router.navigate(['Login']);
      return false;
    }
     return true;	   
  }
}

