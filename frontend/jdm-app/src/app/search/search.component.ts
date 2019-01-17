import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap, map, startWith, filter, debounce} from 'rxjs/operators';

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
      debounceTime(800),
      distinctUntilChanged(),
      startWith(''),
      map((prefix: string) => this._filter(prefix)));
  }

  getAutocompletion(prefix: string): Observable<string[]> {
    return this.apiService.getAutocompletion(prefix);
  }

  private _filter(value: string): string[] {
    console.log('filter');
    if (value.length < 2) {
      this.warningAutocomplete = true;
      console.log('inf 2 lettres');
      return [];
    }
    const filterValue = value.toLowerCase();

    if (typeof this.valueRequest !== 'undefined' && filterValue.startsWith(this.valueRequest)) {
      console.log('previous in new');
      return this.options.filter(option => option.toLowerCase().startsWith(filterValue));
    } else {
      console.log('spinner');
      this.spinner = true;
      this.getAutocompletion(filterValue).subscribe(words => {
        console.log('dans subscribe');
        console.log(words);
        this.options = words;
        this.valueRequest = filterValue;
        this.filteredWords = of(words);
        this.spinner = false;
       });
       return [];
    }
  }

}
