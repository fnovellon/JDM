import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-result-toolbar',
  templateUrl: './result-toolbar.component.html',
  styleUrls: ['./result-toolbar.component.css']
})
export class ResultToolbarComponent implements OnInit {

	value = '';
  options: string[];

  constructor() { 
  }

  ngOnInit() {  	
  	this.options = [""];
  }

}
