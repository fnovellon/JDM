import { Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterContentInit,
  AfterViewInit,
  Inject } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {debounceTime, flatMap, distinctUntilChanged, switchMap, map, startWith, filter, debounce} from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material';

declare var $: any;
// Services
import { ApiService } from '../api.service';
import { AssociationsJsonService, AssociationData } from '../associations-json.service';
import { LOCAL_STORAGE, StorageService } from 'angular-webstorage-service';

import {AssocWord} from '../assocWord';
import {Word} from '../word';

const STORAGE_KEY = 'JDM_Preferences';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, AfterContentInit, AfterViewInit {

  wordControl = new FormControl();
  options: string[] = [];
  valueRequest: string;
  filteredWords: Observable<string[]>;
  spinner = false;
  warningAutocomplete: boolean;
  currentValue = '';

  // Reverse
  pageObject = {pageIndex: 0, pageSize: 25};
  reverseWords: Word[] = [];
  resultReverseAssoc: AssocWord = null;
  currentReverseWordValue = '';

  wordReverseControl = new FormControl();
  assocReverseControl = new FormControl();
  filteredAssocData: Observable<AssociationData[]>;
  filteredReverseWords: Observable<string[]>;
  valueReverseRequest: string;
  allAssociations: AssociationData[] = [];

  reverseAssocChoice: AssociationData = null;
  reverseAssocRequest: AssociationData = null;

  reverseSpinner = false;

  // Check word exist
  wordExist = true;

  @ViewChild('wordInput') wordInput: ElementRef<HTMLInputElement>;

  constructor(private apiService: ApiService,
    private router: Router,
    private associationsJsonService: AssociationsJsonService,
    @Inject(LOCAL_STORAGE) private storage: StorageService) { }

  ngOnInit() {
    // console.log('onInit');
    this.filteredWords = this.wordControl.valueChanges.pipe(
      debounceTime(800),
      distinctUntilChanged(),
      startWith(''),
      flatMap((prefix: string) => this._filter(prefix))
    );

    this.filteredReverseWords = this.wordReverseControl.valueChanges.pipe(
      debounceTime(800),
      distinctUntilChanged(),
      startWith(''),
      flatMap((prefix: string) => this._filterReverse(prefix))
    );

    // console.log(this.storage.get(STORAGE_KEY));

    if (this.storage.get(STORAGE_KEY) != null) {
      const data = JSON.parse(this.storage.get(STORAGE_KEY));
      this.initFiltered(data);
      // console.log('Storage en place');
    } else {
      this.associationsJsonService.getJSONBase().subscribe(data => {
        // console.log('str : ' + JSON.stringify(data[0].name_fr));
        this.storage.set(STORAGE_KEY, JSON.stringify(data));
        // console.log('Local');
        this.initFiltered(data);
      });
    }
  }

  initFiltered(data: AssociationData[]) {
    this.allAssociations = data;

    this.filteredAssocData = this.assocReverseControl.valueChanges.pipe(
      debounceTime(600),
      startWith<string | AssociationData>(''),
      map(value => typeof value === 'string' ? value : value.name + '-' + value.name_fr),
      map((value: string) => value ? this._filterAssoc(value) : this.allAssociations.slice())
    );
  }

  // page des cards
  getData(obj, idAssoc: number) {
    // console.log('getData');
    // console.log(obj);
    // console.log(this.resultReverseAssoc.relations_entrantes[idAssoc] );
    if (this.resultReverseAssoc.relations_entrantes[idAssoc] !== undefined) {
      // console.log('resultReverseAssoc != undefined');
      let index = 0;
      const startingIndex = obj.pageIndex * obj.pageSize,
            endingIndex = startingIndex + obj.pageSize;
      // console.log('startIndex : ' + startingIndex + '- endingIndex : ' + endingIndex);
      const wordsResult: Word[] = this.resultReverseAssoc.relations_entrantes[idAssoc].filter(() => {
        index++;
        return (index > startingIndex && index <= endingIndex) ? true : false;
      });
      // console.log(wordsResult);
      this.reverseWords = wordsResult;
      // console.log('reverseWords : ' + idAssoc);
      // console.log(this.reverseWords);
    }
  }

  ngAfterContentInit(): void {
    // console.log('afterContentInit');
  }

  ngAfterViewInit() {
    // console.log('afterViewInit');
    $(document).ready(function() {
    const moveForce = 40; // max popup movement in pixels
    const rotateForce = 20; // max popup rotation in deg

      $(document).mousemove(function(e) {
        const docX = $(document).width();
        const docY = $(document).height();

        const moveX = (e.pageX - docX / 2) / (docX / 2) * -moveForce;
        const moveY = (e.pageY - docY / 2) / (docY / 2) * -moveForce;

        const rotateY = (e.pageX / docX * rotateForce * 2) - rotateForce;
        const rotateX = -((e.pageY / docY * rotateForce * 2) - rotateForce);

        $('.popup')
        .css('left', moveX + 'px')
        .css('top', moveY + 'px')
        .css('transform', 'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)');
      });
    });
    this.wordInput.nativeElement.focus();
  }

  private _filterAssoc(value: string): AssociationData[] {
    // console.log('filter : ');
    // console.log(value);
    return this.allAssociations.filter(option => {
      const strOption = option.name + '-' + option.name_fr;
      return strOption.toLowerCase().includes(value.toLocaleLowerCase());
    });
  }

  displayFnAssoc(assoc?: AssociationData): string | undefined {
    return assoc ? assoc.name + '-' + assoc.name_fr : undefined;
  }

  showSpinner() {
    return this.spinner === true;
  }

  showReverseSpinner() {
    return this.reverseSpinner === true;
  }

  getAutocompletion(prefix: string): Observable<string[]> {
    return this.apiService.getAutocompletion(prefix);
  }

  selectedReverseWord(event: MatAutocompleteSelectedEvent) {
    const option = event.option.viewValue;
    // console.log('selectedReverseWord : ' + option);
    this.currentReverseWordValue = option;
  }

  selectedReverseAssoc(event: MatAutocompleteSelectedEvent) {
    const option = event.option.value;
    // console.log('selectedReverseAssoc : ' + option);
    this.reverseAssocChoice = option;
  }

  private _filter(value: string): Observable<string[]> {
    this.currentValue = value;
    // console.log('filter');
    if (value.length < 3) {
      this.warningAutocomplete = true;
      // console.log('inf 2 lettres');
      return of([]);
    }
    const filterValue = value.toLowerCase();

    if (typeof this.valueRequest !== 'undefined' && filterValue.startsWith(this.valueRequest)) {
      // console.log('previous in new');
      return of(this.options.filter(option => option.toLowerCase().startsWith(filterValue)));
    } else {
      this.spinner = true;
      // console.log('spinner');
      return this.getAutocompletion(filterValue).pipe(
        map((data: string[]) => {
          // console.log(data);
          this.options = data;
          this.valueRequest = filterValue;
          this.spinner = false;
          return data;
        })
      );
    }
  }

  private _filterReverse(value: string): Observable<string[]> {
    this.currentReverseWordValue = value;
    // console.log('filter');
    if (value.length < 3) {
      this.warningAutocomplete = true;
      // console.log('inf 2 lettres');
      return of([]);
    }
    const filterValue = value.toLowerCase();

    if (typeof this.valueRequest !== 'undefined' && filterValue.startsWith(this.valueRequest)) {
      // console.log('previous in new');
      return of(this.options.filter(option => option.toLowerCase().startsWith(filterValue)));
    } else {
      this.spinner = true;
      // console.log('spinner');
      return this.getAutocompletion(filterValue).pipe(
        map((data: string[]) => {
          // console.log(data);
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
    // console.log('selectedEvent : ' + option);
    this.router.navigate(['results', option]);
  }

  submitNormalSearch() {
    /*console.log('submitNormalSearch');
    console.log(this.currentValue);*/
    if (this.currentValue.trim() !== '') {
      this.router.navigate(['results', this.currentValue]);
    }
  }

  submitReverseSearch() {
    /*console.log('submitReverseSearch');
    console.log('reverseAssocChoice : ' + this.reverseAssocChoice.name );
    console.log('currentReverseWordValue : ' + this.currentReverseWordValue );*/
    if (this.currentReverseWordValue.trim() === '') {
      return;
    }
    this.reverseSpinner = true;
    this.apiService.getReverseWord(this.currentReverseWordValue, this.reverseAssocChoice).subscribe((data) => {
      // console.log('result getReverseWord : ');
      // console.log(data);
      this.reverseAssocRequest = this.reverseAssocChoice;
      this.resultReverseAssoc = data;
      this.wordExist = true;

      if (this.resultReverseAssoc == null) {
        this.resultReverseAssoc = null;
        this.reverseWords = [];
        this.wordExist = false;
        this.reverseSpinner = false;
        return;
      }
      this.getData(this.pageObject, this.reverseAssocChoice.id);
      this.reverseSpinner = false;
    });
  }
}
