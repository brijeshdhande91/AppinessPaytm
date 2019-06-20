import {throwError as observableThrowError, Observable, Subject } from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';
import {IUser} from './register/user.interface'
import { CookieService } from "ngx-cookie-service";
@Injectable({
	providedIn:'root'
})
export class UserService{
	headers : HttpHeaders;
	option : {};
	isLoggedIn : boolean = false;
	baseApiUrl = environment.baseApiUrl;
	credentials :any = {
		SessionID : "",
	};
	constructor( private http:HttpClient ,
				 private _router : Router,
				 private _CookieService : CookieService){
		 this.headers = new HttpHeaders({'Content-type':'application/json', 
		 'Access-Control-Allow-Origin': '*',
		 'Access-Control-Allow-Credentials': 'true'});
	 	this.option = {
			headers : this.headers
		};
	}

	private handleError(error : Response){
		if(error.status != 0){
	   	//let errMsg = error.json();
	    let errMsg = error;	 
	    return observableThrowError(errMsg || "Server Error");	 		
		}else{
			//If any CORS error occurs - cause we are usign countries api to populated the dropdown
			return observableThrowError("Something went wrong. PLease contact admin.");	 
		}

	}

	getCredentials(){
		this.credentials['SessionID'] = this._CookieService.get("UniqueID");
		return this.credentials;
	}

	removeCredentials(){
		
		this._router.navigate(['Login']);
	}
	
	
	register(formData):Observable<IUser>{
		console.log(formData);
		 let body = formData;
		return this.http.post<IUser>(`${this.baseApiUrl}/register`,body,this.option).pipe(catchError(this.handleError));
		
	}
	login(formData):Observable<IUser>{
		console.log(formData);
		 let body = formData;
		return this.http.post<IUser>(`${this.baseApiUrl}/login`,body,this.option).pipe(catchError(this.handleError));
		
	}

	sendMoneyToWallet(formData):Observable<IUser>{
		this.getCredentials();
		console.log(this.credentials);
		formData.user = this.credentials.SessionID;
		let body = JSON.stringify(formData);
		return this.http.post<IUser>(`${this.baseApiUrl}/sendMoneyToWallet`,body,this.option).pipe(catchError(this.handleError));
	}

	addMoneyToWallet(formData):Observable<IUser>{
		this.getCredentials();
		console.log(this.credentials);
		formData.user = this.credentials.SessionID;
		let body = JSON.stringify(formData);
		return this.http.post<IUser>(`${this.baseApiUrl}/addMoneyToWallet`,body,this.option).pipe(catchError(this.handleError));
	}

	getAllTransactions(formData):Observable<IUser>{
		this.getCredentials();
		console.log(this.credentials);
		formData.user = this.credentials.SessionID;
		let body = JSON.stringify(formData);
		return this.http.post<IUser>(`${this.baseApiUrl}/getAllTransactions`,body,this.option).pipe(catchError(this.handleError));
	}
	
}
