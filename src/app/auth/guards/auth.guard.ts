import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot, UrlSegment, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {


  constructor(
    private authService:AuthService,
    private router:Router
  ){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      return this.authService.verificaAutenticacion()
              .pipe(
                tap( isAuthenticated => {
                  if (!isAuthenticated){
                    this.router.navigate(['/auth/login']);
                  }
                })
              );
    //   if (this.authService.auth.id) {
    //     return true;
    //   }

    //   console.log("Bloqueado por el canActivated guard");
      
    // return false;
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | boolean {
      
      return this.authService.verificaAutenticacion()
              .pipe(
                tap( isAuthenticated => {
                  if (!isAuthenticated){
                    this.router.navigate(['/auth/login']);
                  }
                })
              );
    //   if (this.authService.auth.id) {
    //     return true;
    //   }

    //   console.log("Bloqueado por el canLoad guard");
      
    // return false;
  }
}
