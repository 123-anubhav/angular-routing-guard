import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardServiceService implements CanActivate {

  constructor(private authService: AuthService,private route:Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {

    return this.authService.isAuthenticed()
      .then(
        (authenticated: any) => {
          if (authenticated) {
            console.log('Guard Reveives true value ==> Hence routing module will accept and bootstrap to requested routing url');
            return true;
          }
          else {
            console.log('Guard Reveives false value ==> Hence routing module will reject');
            //alert("Guard Reveives false value");
            this.route.navigate(['error']);
            return true;
          }
        }
      )
    /*   .catch(error => {
        console.error(error);

      }); */
      
      //Here we will write our business logic related to authentication and authorization
      throw new Error('Method not implemented.');
  }
}
