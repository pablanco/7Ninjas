import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';

import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';

import { PARAMS } from '../../environments/config';
import { User } from '../models/user.model';

@Injectable()
export class UserService {

  // Datos de la session activa
  private session: string;
  private loggedUser: User;

  constructor(
    private authHttp: AuthHttp,
    private router: Router,
    private http: Http
  ) {

    // Busca datos almacenados en localStorage
    try {
      this.loggedUser = JSON.parse(localStorage.getItem('LoggedUser'));
      this.session = JSON.parse(localStorage.getItem('Session'));
    } catch (err) { }
  }

  Logout(): void {
    localStorage.removeItem('LoggedUser');
    localStorage.removeItem('Session');
    this.router.navigate(['/']);
  }

  Login(userId: string, password: string): Observable<boolean> {

      const loginData: any = {
        userId: userId,
        password: password
      };

      // Set the request
      const url = PARAMS.API + '/auth/login';
      const headers = new Headers({ 'Content-Type': 'application/json' });
      const options = new RequestOptions({ headers: headers, withCredentials: true });
      const body: any = JSON.stringify(loginData);

      return this.http.post(url, body, options)
            .map(response => {
                return response.json();
            })
            .map(response => {
                // Verifiy errors
                if (!response || !response.data) {
                  return false;
                }

                this.session = response.data.session;
                this.loggedUser = {
                  id: response.data.loggedUser.id,
                  name: response.data.loggedUser.name,
                  lastName: response.data.loggedUser.lastName,
                  country: response.data.loggedUser.country.id
                };
                localStorage.setItem('LoggedUser', JSON.stringify(this.loggedUser));
                localStorage.setItem('Session', JSON.stringify(this.session));
                return true;
          }
    );
  }

  GetUserName(): string {
    return this.loggedUser.name;
  }

  IsLogged(): boolean {
    return (this.loggedUser !== null);
  }

  GetUserToken(): string {
    return this.session;
  }

}
