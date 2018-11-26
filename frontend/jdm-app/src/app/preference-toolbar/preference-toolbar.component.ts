import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-preference-toolbar',
  templateUrl: './preference-toolbar.component.html',
  styleUrls: ['./preference-toolbar.component.css']
})
export class PreferenceToolbarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  backToPrevious(){
  	console.log("A compléter");
  }

  savePreference(){
  	console.log("A compléter");
  }

}
