import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

// Model
import { AssocWord } from './assocWord';
import { AssociationData } from './associations-json.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
};

const SERVER_URL = 'http://51.75.253.77/api/';
const WORD_URL = 'mot/';
const AUTOCOMPLETE_URL = 'auto/';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getWord(name: string, associations: AssociationData[]): Observable<AssocWord> {
    let url = '';
    if (associations.length !== 0) {
      url = `${SERVER_URL + WORD_URL}${name}/sortante`;
      let rels = '';
      associations.forEach(assoc => {
        if (rels === '') {
          rels += ';';
        }
      rels += assoc.name;
      });
      url += `?rels=${rels}`;
    } else {
      url = `${SERVER_URL + WORD_URL}${name}`;
    }
    console.log(url);
    return this.http.get<AssocWord>(url, httpOptions).pipe(
      tap(data => {
        console.log(`fetched word name=${name}`);
        // console.log(data);
      }),
      catchError(this.handleError<AssocWord>(`getHero name=${name}`))
    );
  }

  getAutocompletion(prefix: string): Observable<string[]> {
    if (prefix.startsWith('$')) {
      console.log('pouet');
    } else {
      const url = `${SERVER_URL + AUTOCOMPLETE_URL}${prefix}`;
      console.log(url);
      /*return this.http.get<any>(url, httpOptions).pipe(
        tap(data => {
          console.log(`fetched autocomplete prefix=${prefix}`);
          // console.log(data);
          return of(data);
        }),
        catchError(this.handleError<any>(`getAutocompletion prefix=${prefix}`))
      );*/
      return this.http.get<any>(url, httpOptions);
    }
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
