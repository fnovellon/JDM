import { Component, OnInit, ViewChild} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';

// Material
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

// Services
import { WordService } from '../word.service';
import { AssociationsJsonService } from '../associations-json.service';
import { CookieService } from 'ngx-cookie-service';


// Models


/*
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];
*/

export interface AssociationData {
  id: number;
  name: string;
  popularity: number;
  num: number;
  state: number;
}

@Component({
  selector: 'app-preference',
  templateUrl: './preference.component.html',
  styleUrls: ['./preference.component.css']
})
export class PreferenceComponent implements OnInit {

  displayedColumns: string[] = ['select', 'id', 'name', 'popularity', 'num', 'state'];
  dataSource: MatTableDataSource<AssociationData>;
  selection = new SelectionModel<AssociationData>(true, []);
  associations: AssociationData[] = [];


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private wordService: WordService,
    private associationsJsonService: AssociationsJsonService,
    private cookieService: CookieService ) { }

  ngOnInit() {
    // this.getWord('singe');
    if (this.cookieService.check('JDM_Preferences_Cookie')) {
      const data = JSON.parse(this.cookieService.get('JDM_Preferences_Cookie'));
      this.initTable(data);
      console.log('Cookie');
    } else {
      this.associationsJsonService.getJSON().subscribe(data => {
        this.initTable(data);
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
    const index = this.associations.findIndex(element => {
      return element.id === id;
    });
    if (oldState !== -1) {
      this.associations[index].state = -1;
    } else {
      this.associations[index].state = 0;
    }
  }

  updateFav(id: number, oldState: number) {
    console.log('Fav => id : ' + id + ' / oldState : ' + oldState);
    const index = this.associations.findIndex(element => {
      return element.id === id;
    });
    if (oldState !== 1) {
      this.associations[index].state = 1;
    } else {
      this.associations[index].state = 0;
    }
  }

  // Doesn't work on localhost
  savePreferences(event) {
    this.cookieService.set('JDM_Preferences_Cookie', JSON.stringify(this.associations));
    console.log(this.cookieService.check('JDM_Preferences_Cookie'));
    console.log('Save !');
  }

  /*getWord(word: string): void {
    this.wordService.getWord(word)
      .subscribe(resWord => console.log(resWord));
  }*/

}
