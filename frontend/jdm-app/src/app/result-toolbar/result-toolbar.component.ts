import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, Output, EventEmitter, Input } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {debounceTime, flatMap, distinctUntilChanged, switchMap, map, startWith, filter, debounce} from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material';

// Services
import { ApiService } from '../api.service';

@Component({
  selector: 'app-result-toolbar',
  templateUrl: './result-toolbar.component.html',
  styleUrls: ['./result-toolbar.component.css']
})
export class ResultToolbarComponent implements OnInit {


  search = false;
  firstSearchAutocompleteWord = true;
  currentValue = '';
  wordControl = new FormControl();
  options: string[] = [];
  valueRequest: string;
  filteredWords: Observable<string[]>;
  spinner = false;
  warningAutocomplete: boolean;

  @Output()
  searchNewWord: EventEmitter<Object> = new EventEmitter();

  @Input()
  word: string;

  @ViewChild('wordInput') wordInput: ElementRef<HTMLInputElement>;

  constructor(private apiService: ApiService, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.filteredWords = this.wordControl.valueChanges.pipe(
      debounceTime(800),
      distinctUntilChanged(),
      startWith(''),
      flatMap((prefix: string) => this._filter(prefix))
    );
  }

  initiateSearch() {
    // console.log('initiateSearch');
    this.search = true;
  }

  showPreSearchBar() {
    // console.log('showPreSearchBar');
    return this.search === false;
  }

  showSearchBar() {
    // console.log('showSearchBar');
    return this.search !== false;
  }

  endSearchBar() {
    // console.log('endSearchBar');
    this.firstSearchAutocompleteWord = true;
    return this.search = false;
  }

  showSpinner() {
    return this.spinner === true;
  }

  getAutocompletion(prefix: string): Observable<string[]> {
    return this.apiService.getAutocompletion(prefix);
  }

  private _filter(value: string): Observable<string[]> {
    if (this.currentValue !== '' && this.firstSearchAutocompleteWord) {
      value = this.currentValue;
      this.firstSearchAutocompleteWord = false;
    }
    this.currentValue = value;
    console.log('filter : ' + value);
    if (value.length < 3) {
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
          return data;
        })
      );
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const option = event.option.viewValue;
    console.log(option);
    this.firstSearchAutocompleteWord = true;
    this.searchNewWord.emit({'word': option });
  }

  submit(): void {
    console.log('submit');
    console.log(this.currentValue);
    this.firstSearchAutocompleteWord = true;
    this.searchNewWord.emit({'word': this.currentValue });
  }
}
