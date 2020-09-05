import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Post } from './post.model';
import { map, catchError, tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostsService {
  error = new Subject<string>();

  constructor(private http: HttpClient) { }

  createAndStorePost(title: string, content: string) {
    // Send Http request
    const postData: Post = { title, content }
    return this.http
      .post<{ name: string }>(
        'https://ng-complete-guide-b03e0.firebaseio.com/posts.json',
        postData,
        {
          observe: 'response'
        }
      ).subscribe(responseData => {
        console.log(responseData);
      }, error => {
        this.error.next(error.message);
      })
  }

  fetchPosts() {
    // Send Http request
    let searchParams = new HttpParams();
    searchParams = searchParams.append('print', 'pretty')
    searchParams = searchParams.append('custom', 'key')
    return this.http
      .get<{ [key: string]: Post }>(
        'https://ng-complete-guide-b03e0.firebaseio.com/posts.json',
        {
          headers: new HttpHeaders({ 'Custom-Header': 'Hello' }),
          params: searchParams,
          responseType: 'json'
        }
      )
      .pipe(
        map((responseData) => {
          const postsArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key], id: key })
            }
          }
          return postsArray;
        }),
        catchError(errResp => {
          return throwError(errResp);
        })
      );
  }

  clearPosts() {
    return this.http
      .delete(
        'https://ng-complete-guide-b03e0.firebaseio.com/posts.json'
      )
      .pipe(
        tap(event => {
          console.log(event);
        }))
  }
}
