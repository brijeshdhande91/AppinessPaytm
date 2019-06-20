import { Component, OnInit , ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../user.service';
import { CookieService } from "ngx-cookie-service";
import  { CommunicationService } from "../communication.service";
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.less']
})
export class AdminComponent implements OnInit {
  
  form: any;
  walletBalance:number=0;
 
  constructor(private _formBuilder: FormBuilder,
    private _CookieService : CookieService,
    private _communicationservice : CommunicationService ,
    private route: ActivatedRoute,
    private _router : Router ,
    private _authservice : AuthService ,
    private _webApiService: UserService) {}

  ngOnInit() {
    this.getTransactionDetails();
  }
  successMessage='';
  errorMessage='';
  submitted=true;
  payeeNumber: number;
  payeeMoney: any;
  payLoad:any;
  

  logOut(){
    this._CookieService.delete("UniqueID");
    this._CookieService.delete("wallet");
    this._communicationservice.emitChange(this._authservice.isAuthenticated());
    this._router.navigate(["/Login"]);
  }

  myTransactionDetails:any = [];
  getTransactionDetails(){
    console.log("getting");
    this.payLoad = {};
    this.payLoad.mobile = this._CookieService.get('UniqueID');
    this._webApiService.getAllTransactions(this.payLoad).subscribe(
      result => {
        this.errorMessage = "";
        this.successMessage = "";
        if(result.status == 200){
          this.myTransactionDetails = result.data;
        }else{
          this.logOut();
          
        }
      },
      error => {
        this.logOut();
      }
    );
  }
  
}

