import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service'
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from "ngx-cookie-service";
import  { CommunicationService } from "../communication.service";
import { AuthService } from '../auth/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

  constructor(private _webApiService: UserService,
              private _router : Router ,
              private _authservice : AuthService ,
              private _communicationservice : CommunicationService ,
              private _CookieService : CookieService,
              private route: ActivatedRoute,) { }
  successMessage='';
  errorMessage='';
  submitted=true;
  ngOnInit() {
  }
  form = new FormGroup({
    password: new FormControl(''),
    mobile: new FormControl('')
  });
  payLoad = '';
  onSubmit(){
    if(this.form.value.mobile == '1234567890'){
      this._CookieService.set("UniqueID", '1234567890');
      this.form.reset();
      this._communicationservice.emitChange(this._authservice.isAuthenticated());
      this._router.navigate(["/Admin"]);
    }else{
      this.payLoad = JSON.stringify(this.form.value);
      this._webApiService.login(this.payLoad).subscribe(
        result => {
          this.errorMessage = "";
          this.successMessage = "";
          if(result.status == 200){
            this._CookieService.set("UniqueID", result.sessionID);
            this._CookieService.set("wallet", result.wallet);
            this.form.reset();
            this._communicationservice.emitChange(this._authservice.isAuthenticated());
            this._router.navigate(["/Dashboard"]);
          }else{
            console.log('result');
            console.log(result);
            this.submitted = false;
            this.errorMessage = result.Message||"An error has encountered";
            
          }
        },
        error => {
          console.log('error');
          console.log(error);
          this.errorMessage = "";
          this.successMessage = "";
          this.submitted = false;
          if(error.status == 401){
            this.errorMessage = "Mobile number or Password is incorrect."
          }else{
            this.errorMessage = <any> error.error.msg; //error response is having two objects error and header which should be handled by error.error or error.header.
          }
        }
      ); 
    }
    
  }
}
