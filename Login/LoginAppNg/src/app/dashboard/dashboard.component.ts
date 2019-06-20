import { Component, OnInit , ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../user.service';
import { CookieService } from "ngx-cookie-service";
import  { CommunicationService } from "../communication.service";
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  wallet: FormGroup;
  form: any;
  walletBalance:number=0;
  @ViewChild('stepper') stepper;
  constructor(private _formBuilder: FormBuilder,
    private _CookieService : CookieService,
    private _communicationservice : CommunicationService ,
    private route: ActivatedRoute,
    private _router : Router ,
    private _authservice : AuthService ,
    private _webApiService: UserService) {}

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      mobile: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      amount: ['', Validators.required]
    });
    this.wallet = this._formBuilder.group({
      amount: ['', Validators.required]
    });
    this.walletBalance = Number(this._CookieService.get('wallet'));
  }
  successMessage='';
  errorMessage='';
  submitted=true;
  payeeNumber: number;
  payeeMoney: any;
  payLoad:any;
  setNumber(val){
    this.payeeNumber = val.value.mobile;
  }

  setMoney(val){
    this.payeeMoney = 'Rs. '+ val.value.amount;
  }

  logOut(){
    this._CookieService.delete("UniqueID");
    this._CookieService.delete("wallet");
    this._communicationservice.emitChange(this._authservice.isAuthenticated());
    this._router.navigate(["/Login"]);
  }

  sendMoney(){
    this.form = { ...this.firstFormGroup.value, ...this.secondFormGroup.value} 
    console.log(this.form);
    this.payLoad = this.form;
    this._webApiService.sendMoneyToWallet(this.payLoad).subscribe(
      result => {
        this.errorMessage = "";
        this.successMessage = "";
        if(result.status == 200){
          this.firstFormGroup.reset();
          this.secondFormGroup.reset();
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
    this.stepper.reset();
  }

  addMoney(){
    this.payLoad = this.wallet.value;
    this.payLoad.mobile = this._CookieService.get('UniqueID');
    this.payLoad.balance = this.walletBalance;
    this._webApiService.addMoneyToWallet(this.payLoad).subscribe(
      result => {
        this.errorMessage = "";
        this.successMessage = "";
        if(result.status == 200){
          this.wallet.reset();
          this.walletBalance = result.wallet;
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

  updateFunction($event){
    this.getTransactionDetails();
  }
}
