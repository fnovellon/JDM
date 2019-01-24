import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { LOCAL_STORAGE, StorageService } from 'angular-webstorage-service';


const STORAGE_KEY = 'JDM_Preferences';

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
  localList = [];

  constructor(private http: HttpClient, @Inject(LOCAL_STORAGE) private storage: StorageService) {  }

  public getJSON(): Observable<any> {
    return JSON.parse(this.storage.get(STORAGE_KEY));
  }

  public getJSONWord(): Observable<any> {
    return this.http.get('./assets/exempleMot.json');
  }
}
