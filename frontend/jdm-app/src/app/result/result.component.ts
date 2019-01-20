import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, AfterViewInit, ElementRef, ViewChild, HostListener, OnInit, Inject } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {trigger, state, style, animate, transition } from '@angular/animations';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent,
  MatChipInputEvent,
  MatAutocomplete,
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA} from '@angular/material';
import {Observable, of} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap, map, startWith, filter, debounce} from 'rxjs/operators';
import {AssocWord} from '../assocWord';
import {Word} from '../word';
import {TooltipPosition} from '@angular/material';


// Services
import { AssociationsJsonService, AssociationData} from '../associations-json.service';
import { ApiService } from '../api.service';

export interface DialogData {
  itemSelect: string[];
}

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit, AfterViewInit {

  wordParam: string;
  preferences: AssociationData[] = [];
  selectedAssociation: AssociationData[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  associationCtrl = new FormControl();
  filteredAssociations: Observable<string[]>;
  splitted: string[] = [];

  // Associations pour l'auto complete
  allAssociations: AssociationData[] = [];
  associations: AssociationData[] = [];

  // resultat de l'assoc
  resultAssoc: AssocWord = null;
  resultAssocData: Object = {};

  // spinner
  showSpinner = true;

  // page
  pageObject = {};

  @ViewChild('associationInput') associationInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('stickyMenu') menuElement: ElementRef;

  sticky = false;
  elementPosition: any;

  constructor(public dialog: MatDialog,
    private associationsJsonService: AssociationsJsonService,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService) { }

  @HostListener('window:scroll', ['$event'])
    handleScroll() {
      if (this.sticky === false) {
        this.elementPosition = this.menuElement.nativeElement.offsetTop;
      }
      const windowScroll = window.pageYOffset;
      if (windowScroll > this.elementPosition) {
        this.sticky = true;
      } else {
        this.sticky = false;
      }
    }

  ngOnInit() {

    // Get param of url
    this.wordParam = this.activatedRoute.snapshot.paramMap.get('word');
    console.log('word in url : ' + this.wordParam);

    // Observable for autocomplete
    this.filteredAssociations = this.associationCtrl.valueChanges.pipe(
      debounceTime(800),
      distinctUntilChanged(),
      startWith(''),
      map((association: AssociationData) => this._filter(association))
    );

    // Get associations from JSON
    this.associationsJsonService.getJSON().subscribe(data => {
      data.forEach(assoc => {
        this.allAssociations.push(assoc);
      });
      this.selectedAssociation = this.allAssociations.filter(assoc => assoc.state === 1);

      this.requestForAssoc(this.selectedAssociation).subscribe((word) => {
        console.log('avant');
        this.resultAssoc = word;

        // Tests on data
        /*console.log(this.resultAssoc);
        console.log(this.resultAssoc.relations_sortantes[0][0].noeud);
        console.log(typeof this.resultAssoc.relations_sortantes[12] !== 'undefined');*/

        this.selectedAssociation.forEach((assoc) => {
          this.pageObject[assoc.id] = {'page': 0, 'size': 18};
          this.getData({pageIndex: 0, pageSize: 18}, assoc.id);
        });
        console.log('Fin OnInit');
        this.showSpinner = false;
      });
    });
  }

  // Scroll
  ngAfterViewInit() {
    this.elementPosition = this.menuElement.nativeElement.offsetTop;
  }

  private _filter(value: AssociationData): AssociationData[] {
    const filterValue = value.name_fr;
    return this.allAssociations.filter(option => option.name_fr.toLowerCase().includes(filterValue));
  }

  requestForAssoc(associations: AssociationData[]): Observable<AssocWord> {
    const relToRequest: AssociationData[] = associations.filter((assoc) => {
      return typeof this.resultAssocData[assoc.id] === 'undefined';
    });
    console.log('requestForAssoc');
    console.log(relToRequest);
    if (relToRequest.length > 0) {
      return this.apiService.getWord(this.wordParam, relToRequest);
    }
  }

  addToAssoc(assoc: AssociationData) {
    this.selectedAssociation.push(assoc);
    const index = this.preferences.findIndex((item) => {
      return item.name === assoc.name;
    });
    if (index !== -1) {
      this.preferences.splice(index, 1);
      this.requestForAssoc([assoc]);
    }
  }

  removeAssocSelected(assoc: AssociationData) {
    const index = this.selectedAssociation.findIndex((element) => {
     return element.name === assoc.name;
    });
    if (index !== -1 ) {
      this.selectedAssociation.splice(index, 1);
      if (assoc.state === 1) {
        this.preferences.push(assoc);
      }
    }
  }

  // page des cards
  getData(obj, idAssoc: number) {
    if (this.resultAssoc.relations_sortantes[idAssoc] !== undefined) {
      let index = 0;
      const startingIndex = obj.pageIndex * obj.pageSize,
            endingIndex = startingIndex + obj.pageSize;
      const wordsResult: Word[] = this.resultAssoc.relations_sortantes[idAssoc].filter(() => {
        index++;
        return (index > startingIndex && index <= endingIndex) ? true : false;
      });
      this.resultAssocData[idAssoc] = wordsResult;
    }
  }

  // push la valeur de l'autocomplete dans les assoc selectionné
  selected(event: MatAutocompleteSelectedEvent): void {
    const tmpAssoc = this.allAssociations.find(assoc => {
      return assoc.name_fr === event.option.viewValue;
    });
    this.selectedAssociation.push(tmpAssoc);
    this.associationInput.nativeElement.value = '';
    this.associationCtrl.setValue(null);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ModalAssociation, {
      width: '80%',
      data: {itemSelect: this.associations}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('result' + result);
      if (result !== undefined) {
        this.splitted = result.toString().split(',');
        console.log('result : ' + result);
        for (const r of this.splitted) {
          const tmpAssoc = this.allAssociations.find(assoc => {
            return assoc.name_fr === r;
          });
          this.selectedAssociation.push(tmpAssoc);
        }
      }
    });
  }

  searchNewWord($event) {
    const selectedWord = $event.word;
    console.log('searchNewWord : ' + selectedWord);
    // TODO: try to search how reload a component or do reload by yourself
  }
}

@Component({
  selector: 'modalAssociation',
  templateUrl: 'modalAssociation.html',
  styleUrls: ['./modalAssociation.css']
})
export class ModalAssociation implements OnInit {

  associations: string[] = [];
  itemSelect: string[] = [];

  constructor(public dialogRef: MatDialogRef<ModalAssociation>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private associationsJsonService: AssociationsJsonService) {
        console.log(this.itemSelect);
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(){
    this.associationsJsonService.getJSON().subscribe(data => {
      data.forEach(assoc => {
        if(assoc.state == 0){
          this.associations.push(assoc.name_fr);
        }
      });
    });
  }

  selectedItem(itemAssoc: string){
    this.itemSelect.push(itemAssoc);

    this.associations.forEach((item, index) => {
     if(item === itemAssoc) this.associations.splice(index,1);
   });
    console.log(this.itemSelect);
    this.data.itemSelect = this.itemSelect;
  }

  removeSelection(doc: string){
    this.itemSelect.forEach((item, index) => {
     if(item === doc) this.itemSelect.splice(index,1);
   });
    this.associations.push(doc);
  }

}
