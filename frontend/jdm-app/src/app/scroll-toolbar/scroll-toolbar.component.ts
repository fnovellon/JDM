import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-scroll-toolbar',
  templateUrl: './scroll-toolbar.component.html',
  styleUrls: ['./scroll-toolbar.component.css']
})
export class ScrollToolbarComponent implements OnInit {

	sort : number = 0;
	logoSort : string = "arrow_upward";

  constructor() { }

  ngOnInit() {
  }


  sortOrder(){
  	if(this.sort == 0){
  		this.logoSort = "arrow_downward";
  		this.sort = 1;
  	}else if(this.sort == 1){
  		this.logoSort = "arrow_upward";
  		this.sort = 0;
  	}
  }

}
