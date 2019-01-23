import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CookieService } from 'ngx-cookie-service';

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

  constructor(private http: HttpClient, private cookieService: CookieService) {  }

  public getJSON(): Observable<any> {
    return this.http.get('./assets/associations.json');
  }

  public getJSONWord(): Observable<any> {
    return this.http.get('./assets/exempleMot.json');
  }
}
