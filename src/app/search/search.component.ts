import { Component, OnInit, ViewChild, ElementRef, AfterContentInit, AfterViewInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {debounceTime, flatMap, distinctUntilChanged, switchMap, map, startWith, filter, debounce} from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material';

declare var $: any;
// Services
import { ApiService } from '../api.service';

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

  @ViewChild('wordInput') wordInput: ElementRef<HTMLInputElement>;

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit() {
    console.log('onInit');
    this.filteredWords = this.wordControl.valueChanges.pipe(
      debounceTime(800),
      distinctUntilChanged(),
      startWith(''),
      flatMap((prefix: string) => this._filter(prefix))
    );
  }

  ngAfterContentInit(): void {
    console.log('afterContentInit');
  }

  ngAfterViewInit() {
    console.log('afterViewInit');
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

  showSpinner() {
    return this.spinner === true;
  }

  getAutocompletion(prefix: string): Observable<string[]> {
    return this.apiService.getAutocompletion(prefix);
  }

  private _filter(value: string): Observable<string[]> {
    this.currentValue = value;
    console.log('filter');
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
    console.log('selectedEvent : ' + option);
    this.router.navigate(['results', option]);
  }

  submitNormalSearch() {
    console.log('submitNormalSearch');
    console.log(this.currentValue);
    if (this.currentValue.trim() !== '') {
      this.router.navigate(['results', this.currentValue]);
    }
  }

  submitReverseSearch() {
    console.log('submitReverseSearch');
    /*console.log(this.currentValue);
    if (this.currentValue.trim() !== '') {
      this.router.navigate(['results', this.currentValue]);
    }*/
  }
}
