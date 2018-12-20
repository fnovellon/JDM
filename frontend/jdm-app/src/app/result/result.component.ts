import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, AfterViewInit, ElementRef, ViewChild, HostListener, OnInit, Inject } from '@angular/core';
import {trigger, state, style, animate, transition } from '@angular/animations';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete, MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap, map, startWith} from 'rxjs/operators';
import {AssocWord} from '../assocWord';
import {Word} from '../word';
import {TooltipPosition} from '@angular/material';
import { AssociationsJsonService, AssociationData} from '../associations-json.service';

export interface DialogData {
  itemSelect: string[];
}

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  preferences : AssociationData[];
  selectedAssociation : AssociationData[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  associationCtrl = new FormControl();
  filteredAssociations: Observable<string[]>;
  splitted: string[] = [];

  //Associations pour l'auto complete
  allAssociations: AssociationData[] = [];
  allAssociations_r : string[] = [];
  associations: AssociationData[] = [];

  //resultat de l'assoc
  resultAssoc: AssocWord;
  resultAssocData: Word[] = [];

  //page 
  page = 0;
  size = 18;

  @ViewChild('associationInput') associationInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('stickyMenu') menuElement: ElementRef;

  sticky: boolean = false;
  elementPosition: any;

  constructor(public dialog: MatDialog, private associationsJsonService: AssociationsJsonService) {}

  @HostListener('window:scroll', ['$event'])
    handleScroll(){
      if(this.sticky == false){
        this.elementPosition = this.menuElement.nativeElement.offsetTop;
      }
      const windowScroll = window.pageYOffset;
      console.log(this.elementPosition);
      console.log(windowScroll);
      if(windowScroll > this.elementPosition){
        this.sticky = true;
      } else {
        this.sticky = false;
      }
    }

  ngOnInit(){
      this.filteredAssociations = this.associationCtrl.valueChanges.pipe(
      debounceTime(800),
      distinctUntilChanged(),
      startWith(''),
      map((association: AssociationData) => this._filter(association)));

    this.associationsJsonService.getJSON().subscribe(data => {
      data.forEach(assoc => {
        this.allAssociations.push(assoc);
      });
      this.preferences = this.allAssociations.filter(assoc => assoc.state == 1);
      console.log(this.preferences)
    });

    this.associationsJsonService.getJSONWord().subscribe(data => {
      this.resultAssoc = data;
    });
  }

    //Scroll 
  ngAfterViewInit(){
    this.elementPosition = this.menuElement.nativeElement.offsetTop;
  }

  private _filter(value: AssociationData): AssociationData[]{
    const filterValue = value.name_fr;
    return this.allAssociations.filter(option => option.name_fr.toLowerCase().includes(filterValue));
  }
  
  addToAssoc(assoc: AssociationData){
    this.selectedAssociation.push(assoc);
    this.preferences.forEach((item, index) => {
     if(item.name_fr === assoc.name_fr) this.preferences.splice(index,1);
   });
    this.getData({pageIndex: this.page, pageSize: this.size}, "0");
  }

/*
  add(event: MatChipInputEvent): void {
    // Add association only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our association
      if ((value || '').trim()) {
        this.associations.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }
      this.associationCtrl.setValue(null);
    }
  }

  remove(association: AssociationData): void {
    const index = this.associations.indexOf(association);

    if (index >= 0) {
      this.associations.splice(index, 1);
    }
  }
  */

  removeAssocSelected(assoc: AssociationData){
    this.selectedAssociation.forEach((item, index) => {
     if(item.name_fr === assoc.name_fr) this.selectedAssociation.splice(index,1);
   });
  }

  //page des cards
  getData(obj, idAssoc: string) {
    let index=0,
        startingIndex=obj.pageIndex * obj.pageSize,
        endingIndex=startingIndex + obj.pageSize;

    this.resultAssocData = this.resultAssoc.relations_sortantes[idAssoc].filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
  }

  //push la valeur de l'autocomplete dans les assoc selectionné
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
      if(result!=null){
        this.splitted = result.toString().split(",");
        console.log("result : " + result);
        for(let r of this.splitted){
          const tmpAssoc = this.allAssociations.find(assoc => {
            return assoc.name_fr === r;
          });
          this.selectedAssociation.push(tmpAssoc);
        }
      }
    });
  }
}

@Component({
  selector: 'modalAssociation',
  templateUrl: 'modalAssociation.html',
  styleUrls: ['./modalAssociation.css']
})
export class ModalAssociation implements OnInit {


  constructor(public dialogRef: MatDialogRef<ModalAssociation>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private associationsJsonService: AssociationsJsonService) {}

  associations: string[] = [];
  itemSelect: string[] = [];

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(){
    this.associationsJsonService.getJSON().subscribe(data => {
      data.forEach(assoc => {
        this.associations.push(assoc.name_fr);
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
