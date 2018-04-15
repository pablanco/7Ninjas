import { Headers, Response, RequestOptions } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { PARAMS } from '../../environments/config';
import { Planet } from '../models/planet.model';

@Injectable()
export class PlanetService {

  public onResultsChanged: Subject<any> = new Subject<Planet>();
  public onSearchChanged: Subject<any> = new Subject<Planet[]>();

  constructor(
    private authHttp: AuthHttp
  ) { }

  DoSearch(planetId: string): Observable<boolean> {

    const planetData: any = {
      planetId: planetId
    };

    // Set the request
    const url = PARAMS.API + '/planets';
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const body = JSON.stringify(planetData);
    const options = new RequestOptions({ headers: headers, withCredentials: true });

    return this.authHttp.post(url, body, options)
      .map(response => {
        return response.json();
      })
      .map(response => {
        // Verifiy errors
        if (!response || response.error) {
          return false;
        } else {
          // Broadcast Data Change
          this.onResultsChanged.next(response.data);
          return true;
        }
      });
  }

  GetPlanets(): Observable<boolean> {

    // Set the request
    const url = PARAMS.API + '/planets';
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers, withCredentials: true });

    return this.authHttp.get(url, options)
      .map(response => {
        return response.json();
      })
      .map(planets => {
        // Broadcast Data Change
        this.onSearchChanged.next(planets.data);
        return true;
      });
  }

  DeletePlanet(planetID: string): Observable<boolean> {

    // Set the request
    const url = PARAMS.API + '/planets/' + planetID;
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers, withCredentials: true });

    return this.authHttp.delete(url, options)
      .map(response => {
        return response.json();
      })
      .map(result => {
        return true;
      });
  }

}
