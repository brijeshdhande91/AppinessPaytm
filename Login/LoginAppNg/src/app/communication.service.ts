import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

	constructor() { }

	private emitChangeToSource = new Subject<any>();
	changeEmitted$ = this.emitChangeToSource.asObservable();

  	emitChange(value:any){
  	 	this.emitChangeToSource.next(value);
  	}
}
