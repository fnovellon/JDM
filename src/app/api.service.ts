import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {PlatformLocation } from '@angular/common';

// Model
import { AssocWord } from './assocWord';
import { AssociationData } from './associations-json.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
};

const SERVER_URL = 'http://51.75.253.77:8080/api/';
const WORD_URL = 'mot/';
const AUTOCOMPLETE_URL = 'auto/';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, public platformLocation: PlatformLocation) { }

  getWord(name: string, associations: AssociationData[]): Observable<AssocWord> {
    let url = '';
    if (associations.length !== 0) {
      url += `${SERVER_URL + WORD_URL + name}/sortante`;
      let rels = '';
      associations.forEach(assoc => {
        if (rels !== '') {
          rels += ';';
        }
        rels += assoc.name;
      });
      url += `?rels=${rels}`;
    } else {
      url += `${SERVER_URL + WORD_URL + name}`;
    }
    console.log(url);
    return this.http.get<AssocWord>(url, httpOptions).pipe(
      tap(data => {
        console.log(`fetched word name=${name}`);
        // console.log(data);
      }),
      catchError(this.handleError<AssocWord>(`get word name=${name}`))
    );
  }

  getAutocompletion(prefix: string): Observable<string[]> {
    const url = `${SERVER_URL + AUTOCOMPLETE_URL + prefix}`;
    console.log(url);
    return this.http.get<any>(url, httpOptions);
  }

  getReverseWord(name: string, association: AssociationData): Observable<AssocWord> {
    const url = `${SERVER_URL + WORD_URL + name}/sortante?rels=${association.name}`;
    console.log(url);
    return this.http.get<AssocWord>(url, httpOptions).pipe(
      tap(data => {
        console.log(`fetched reverse word name=${name}`);
        // console.log(data);
      }),
      catchError(this.handleError<AssocWord>(`get reverse word name=${name}`))
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

