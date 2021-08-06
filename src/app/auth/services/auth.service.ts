import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

import { Auth } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl:string = environment.baseUrl;
  private _auth:Auth | undefined;

  get auth():Auth {
    return {...this._auth!}; // 
  }

  constructor(
    private http:HttpClient
  ) { }

  verificaAutenticacion():Observable<boolean> {
    if (!localStorage.getItem("token")) {
      return of(false); // resolve de Observable<boolean>
    }

    //return true; // | boolean
    return this.http.get<Auth>(`${ this.baseUrl }/usuarios/1`)
            .pipe(
              map(auth => {
                this._auth = auth;
                return true;
              })
            );

  }

  login() {
    return this.http.get<Auth>(`${ this.baseUrl }/usuarios/1`)
            .pipe(
              tap(resp => this._auth = resp),
              tap(resp => localStorage.setItem("token", resp.id)),
            );
  }

  logout() {
    localStorage.clear();
    this._auth = undefined;
  }
  
}
