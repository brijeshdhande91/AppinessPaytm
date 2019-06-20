import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { CookieService } from "ngx-cookie-service";
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _CookieService : CookieService){}
  public isAuthenticated(): boolean {
      const token: boolean = this._CookieService.check('UniqueID'); // Check whether the token is expired and return true or false   
      return token; 
  }
}
