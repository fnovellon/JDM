import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

// Model
import { ResWord } from './resWord';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class WordService {
  private heroesUrl = 'mot/';  // URL to web api
  constructor(private http: HttpClient) { }

  getWord(id: string): Observable<ResWord> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<ResWord>(url).pipe(
      tap(data => {
        console.log(`fetched hero id=${id}`);
        console.log(data);
      }),
      catchError(this.handleError<ResWord>(`getHero id=${id}`))
    );
  }

    /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
