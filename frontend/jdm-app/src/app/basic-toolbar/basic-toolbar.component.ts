import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-basic-toolbar',
  templateUrl: './basic-toolbar.component.html',
  styleUrls: ['./basic-toolbar.component.css']
})
export class BasicToolbarComponent implements OnInit {

  value = '';

  constructor() { }

  ngOnInit() {
  }

}
