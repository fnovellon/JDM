import { Component, OnInit, ViewChild, Inject, Injectable } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';

// Material
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

// Services
import { AssociationsJsonService, AssociationData } from '../associations-json.service';
import { LOCAL_STORAGE, StorageService } from 'angular-webstorage-service';

const STORAGE_KEY = 'JDM_Preferences';


@Component({
  selector: 'app-preference',
  templateUrl: './preference.component.html',
  styleUrls: ['./preference.component.css']
})
export class PreferenceComponent implements OnInit {

  displayedColumns: string[] = ['select', 'id', 'name', 'name_fr', 'popularity', 'num', 'state'];
  dataSource: MatTableDataSource<AssociationData>;
  selection = new SelectionModel<AssociationData>(true, []);
  associations: AssociationData[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private associationsJsonService: AssociationsJsonService, @Inject(LOCAL_STORAGE) private storage: StorageService) { }

  ngOnInit() {

    if (this.storage.get(STORAGE_KEY) != null) {
      const data = JSON.parse(this.storage.get(STORAGE_KEY));
      this.initTable(data);
      console.log('Storage en place');
    } else {
      this.associationsJsonService.getJSON().subscribe(data => {
        this.initTable(data);
        console.log("str : " + JSON.stringify(data[0].name_fr));
        this.storage.set(STORAGE_KEY, JSON.stringify(data));
        console.log('Local');
    });
    }
  }

  initTable(data) {
    data.forEach(assoc => {
      this.associations.push(assoc);
    });
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.associations);

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  updateVisibility(id: number, oldState: number) {
    console.log('Visibility => id : ' + id + ' / oldState : ' + oldState);
    if (oldState !== -1) {
      this.updateAsso(id, -1);
    } else {
      this.updateAsso(id, 0);
    }
  }

  updateFav(id: number, oldState: number) {
    console.log('Fav => id : ' + id + ' / oldState : ' + oldState);
    if (oldState !== 1) {
      this.updateAsso(id, 1);
    } else {
      this.updateAsso(id, 0);
    }
  }

  updateAsso(id: number, newState: number) {
    const index = this.associations.findIndex(element => {
      return element.id === id;
    });
    this.associations[index].state = newState;
  }

  addSelectionByState(state: number) {
    console.log('addSelectionByState');
    this.selection.selected.forEach(association => {
      this.updateAsso(association.id, state);
    });
    this.selection.clear();
  }

  // Doesn't work on localhost
  savePreferences(event) {
    this.storage.set(STORAGE_KEY, JSON.stringify(this.associations));
    console.log('???' + this.storage.get(STORAGE_KEY));
    console.log('Save !');
  }

  /*getWord(word: string): void {
    this.apiService.getWord(word, [])
      .subscribe(resWord => console.log(resWord));
  }*/

}
