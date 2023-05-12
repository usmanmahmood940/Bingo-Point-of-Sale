import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs/';


@Injectable({
  providedIn: 'root'
})
export class AppStateService implements OnDestroy {

  private breakoutRoomParticipants: BehaviorSubject<[]> = new BehaviorSubject<[]>([]);
  private isRightSideDetails: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  subscriptions: Subscription[] = [];
  private currentCall = new Subject<any>();

  private connectedUser = {
    email: '',
    emailaddress_rb: '',
    sessionToken: '',
    theme: '',
    language: '',
    customLanguage: '',
    userrole: ''
  };

  constructor() { }

  setConnectedUserValues(connectedUser: any): void {
    this.connectedUser = { ...connectedUser };
  }
  getConnectedUser(): object {
    return { ...this.connectedUser };
  }

  passCurrentCall(call: any): void {
    this.currentCall.next(call);
  }

  clearCurrentCall(): void {
    this.currentCall.next('');
  }

  getCurrentCall(): Observable<any> {
    return this.currentCall.asObservable();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
