import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-toolbar',
  templateUrl: './search-toolbar.component.html',
  styleUrls: ['./search-toolbar.component.css']
})
export class SearchToolbarComponent implements OnInit {

	value = '';
  options: string[];

  constructor() { 
  }

  ngOnInit() {  	
  	this.options = [""];
  }

}
