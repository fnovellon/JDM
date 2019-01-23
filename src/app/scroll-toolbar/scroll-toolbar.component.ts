import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-scroll-toolbar',
  templateUrl: './scroll-toolbar.component.html',
  styleUrls: ['./scroll-toolbar.component.css']
})
export class ScrollToolbarComponent implements OnInit {

  sortAsc = false;
  logoSort = 'arrow_downward';

  sortDisplay = 'Tri par poids';
  sortType = 'weight';

  filter = '';

  @Output()
  filterToolbarChanged: EventEmitter<Object> = new EventEmitter();

  @Output()
  sortToolbarChanged: EventEmitter<Object> = new EventEmitter();

  constructor() { }

  ngOnInit() {  }


  sortOrder() {
    if (this.sortAsc) {
      this.logoSort = 'arrow_downward';
      this.sortAsc = false;
    } else {
      this.logoSort = 'arrow_upward';
      this.sortAsc = true;
    }
    this.sendSignalSort();
  }

  weightChoice() {
    this.sortDisplay = 'Tri par poids';
    this.sortType = 'weight';
    this.sendSignalSort();
  }

  alphaChoice() {
    this.sortDisplay = 'Tri alphabétique';
    this.sortType = 'alpha';
    this.sendSignalSort();
  }

  filterItems(value: string) {
    console.log('filter toolbar');
    console.log(value);
    this.filter = value;
    this.sendSignalFilter();
  }

  sendSignalFilter() {
    this.filterToolbarChanged.emit({filter : this.filter});
  }

  sendSignalSort() {
    this.sortToolbarChanged.emit({sortType: this.sortType, sortAsc: this.sortAsc});
  }
}
