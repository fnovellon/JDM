import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-preference-toolbar',
  templateUrl: './preference-toolbar.component.html',
  styleUrls: ['./preference-toolbar.component.css']
})
export class PreferenceToolbarComponent implements OnInit {

  constructor(private route: ActivatedRoute, private location: Location) { }

  ngOnInit() {
  }

  backToPrevious(){
  	this.location.back();
  }

  savePreference(){
  	console.log("A compléter");
  }

}
