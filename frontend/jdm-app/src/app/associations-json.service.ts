import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AssociationData {
  id: number;
  name: string;
  name_fr: string;
  popularity: number;
  num: number;
  state: number;
}

@Injectable({
  providedIn: 'root'
})
export class AssociationsJsonService {



  constructor(private http: HttpClient) { }

  public getJSON(): Observable<any> {
    return this.http.get('./assets/associations.json');
  }
}
