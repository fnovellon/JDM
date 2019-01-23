import { Component, OnInit, Output, HostListener, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-preference-toolbar',
  templateUrl: './preference-toolbar.component.html',
  styleUrls: ['./preference-toolbar.component.css']
})
export class PreferenceToolbarComponent implements OnInit {

  @Output()
  savePreferences: EventEmitter<null> = new EventEmitter();


  constructor(private route: ActivatedRoute, private location: Location) { }

  ngOnInit() {
  }

  /*@HostListener('click')
  click() {
    this.clickOnSave.emit();
  }*/

  backToPrevious() {
    this.location.back();
  }

  clickSavePreference() {
    console.log('Need Save Toolbar');
    this.savePreferences.emit();
  }

}
