import { Headers, Response, RequestOptions } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { PARAMS } from '../../environments/config';
import { Comment } from '../models/comment.model';

@Injectable()
export class CommentService {

  public onCommentsChanged: Subject<any> = new Subject<Comment[]>();

  constructor(
    private authHttp: AuthHttp
  ) { }

  SaveComment(planetId: string, comment: string): Observable<boolean> {

    const commentData: Comment = {
      planetID: planetId,
      text: comment
    };

    // Set the request
    const url = PARAMS.API + '/comments';
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const body = JSON.stringify(commentData);
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
          return true;
        }
      });
  }

  GetComments(): Observable<boolean> {

    // Set the request
    const url = PARAMS.API + '/comments';
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers, withCredentials: true });

    return this.authHttp.get(url, options)
      .map(response => {
        return response.json();
      })
      .map(comments => {
        // Broadcast Data Change
        this.onCommentsChanged.next(comments.data);
        return true;
      });
  }

}
