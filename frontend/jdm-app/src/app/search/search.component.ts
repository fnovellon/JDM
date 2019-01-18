import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {debounceTime, flatMap, distinctUntilChanged, switchMap, map, startWith, filter, debounce} from 'rxjs/operators';

// Services
import { ApiService } from '../api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  wordControl = new FormControl();
  options: string[] = [];
  valueRequest: string;
  filteredWords: Observable<string[]>;
  spinner = false;
  warningAutocomplete: boolean;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.filteredWords = this.wordControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      startWith(''),
      flatMap((prefix: string) => this._filter(prefix))
    );
  }

  showSpinner() {
    return this.spinner === true;
  }

  getAutocompletion(prefix: string): Observable<string[]> {
    return this.apiService.getAutocompletion(prefix);
  }

  private _filter(value: string): Observable<string[]> {
    console.log('filter');
    if (value.length < 2) {
      this.warningAutocomplete = true;
      console.log('inf 2 lettres');
      return of([]);
    }
    const filterValue = value.toLowerCase();

    if (typeof this.valueRequest !== 'undefined' && filterValue.startsWith(this.valueRequest)) {
      console.log('previous in new');
      return of(this.options.filter(option => option.toLowerCase().startsWith(filterValue)));
    } else {
      this.spinner = true;
      console.log('spinner');
      return this.getAutocompletion(filterValue).pipe(
        map((data: string[]) => {
          console.log(data);
          this.options = data;
          this.valueRequest = filterValue;
          this.spinner = false;
          return data.slice(0, 250);
        })
      );
    }
  }
}
