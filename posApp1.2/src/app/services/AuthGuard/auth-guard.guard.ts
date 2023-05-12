import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree,CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class AuthGuardGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // check if the user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    // if the user is not logged in, redirect them to a login page
    if (isLoggedIn) {
      return true;
    }
    this.router.navigate(["/login"]);
    return false;
  }

  // canActivateChild(
  //   childRoute: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot
  // ):
  //   | Observable<boolean | UrlTree>
  //   | Promise<boolean | UrlTree>
  //   | boolean
  //   | UrlTree {
  //     // check if the user is logged in
  //     const isLoggedIn = localStorage.getItem("isLoggedIn");

  //     // if the user is not logged in, redirect them to a login page
  //     if (isLoggedIn) {
  //       return true;
  //     }
  //     this.router.navigate(["/login"]);
  //     return false;
  //   }
}
