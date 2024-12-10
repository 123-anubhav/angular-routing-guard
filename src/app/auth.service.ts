import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedIn: boolean = false;

  constructor() { }

  isAuthenticed() {
    const promise = new Promise(
      (resolve, reject) => {
        // back end rest api calls here
        setTimeout(
          () => {
            resolve(this.loggedIn)
          }, 2000
        );
      }
    )
    return promise;
  }

  login() {
    this.loggedIn = true;
  }

  logout() {
    this.loggedIn = false;
  }
}
