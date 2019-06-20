import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service'
import { FormGroup, FormControl } from '@angular/forms';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit {
  constructor(private _webApiService: UserService) { }
  successMessage='';
  errorMessage='';
  submitted=true;
  ngOnInit() {
  }
  form = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    mobile: new FormControl('')
  });
  payLoad = '';
  onSubmit(){
    this.payLoad = JSON.stringify(this.form.value);
    this._webApiService.register(this.payLoad).subscribe(
      result => {
        this.errorMessage = "";
        this.successMessage = "";
        if(result.status == 200){
          this.successMessage = "Thankyou for registering with us, please login to use our services."
          this.form.reset();
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
          this.errorMessage = "You are already registered with us."
        }else{
          this.errorMessage = <any> error.error.msg; //error response is having two objects error and header which should be handled by error.error or error.header.
        }
      }
    ); 
    }
}
