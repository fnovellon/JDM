import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-result-toolbar',
  templateUrl: './result-toolbar.component.html',
  styleUrls: ['./result-toolbar.component.css']
})
export class ResultToolbarComponent implements OnInit {

  search = false;
  searchValue = '';

  constructor() { }

  ngOnInit() { }

  initiateSearch() {
    console.log('initiateSearch');
    this.search = true;
  }

  showPreSearchBar() {
    console.log('showPreSearchBar');
    return this.search === false;
  }

  showSearchBar() {
    console.log('showSearchBar');
    return this.search !== false;
  }

  endSearchBar() {
    console.log('endSearchBar');
    return this.search = false;
  }

  submit() {
    console.log('submit');
  }
}
