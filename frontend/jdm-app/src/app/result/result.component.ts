import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, ElementRef, ViewChild, OnInit, Inject } from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete, MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

export interface DialogData {
  itemSelect: string[];
}

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent {

  preference : string[];
  selectedAssociation : string[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  associationCtrl = new FormControl();
  filteredAssociations: Observable<string[]>;
  splitted: string[] = [];
  //Associations pour l'auto complete
  allAssociations: string[] = ['is_a', 'gender', 'synonyme', 'desc', 'width'];
  associations: string[] = [];


  @ViewChild('associationInput') associationInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(public dialog: MatDialog) {
    this.filteredAssociations = this.associationCtrl.valueChanges.pipe(
        startWith(null),
        map((association: string | null) => association ? this._filter(association) : this.allAssociations.slice()));
  }

  ngOnInit(){
    this.preference = ["test1", "test2"];
  }

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
  
  addToAssoc(assoc: string){
    this.selectedAssociation.push(assoc);
    this.preference.forEach((item, index) => {
     if(item === assoc) this.preference.splice(index,1);
   });
  }

  remove(association: string): void {
    const index = this.associations.indexOf(association);

    if (index >= 0) {
      this.associations.splice(index, 1);
    }
  }

  removeAssocSelected(assoc: string){
    this.selectedAssociation.forEach((item, index) => {
     if(item === assoc) this.selectedAssociation.splice(index,1);
   });
  }

  //push la valeur de l'autocomplete dans les assoc selectionné
  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedAssociation.push(event.option.viewValue);
    this.associationInput.nativeElement.value = '';
    this.associationCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allAssociations.filter(association => association.toLowerCase().indexOf(filterValue) === 0);
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(ModalAssociation, {
      width: '50%',
      data: {itemSelect: this.associations}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result!=null){
        this.splitted = result.toString().split(",");
        console.log("result : " + result);
        for(let r of this.splitted){
          this.selectedAssociation.push(r);
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
export class ModalAssociation {


  constructor(public dialogRef: MatDialogRef<ModalAssociation>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  associations: string[] = ['is_a', 'description','associaiton3', 'associaiton4','is_a1', 'iéés_a','a&ssociaiton3', 'is_fa', 'desfscription','associagfiton3', 'associaifgton3','ifds_a', 'is_ag','assgdociaiton3', 'ihhys_a','fdifs_a', 'isdd_a'];
  itemSelect: string[] = [];

  onNoClick(): void {
    this.dialogRef.close();
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
