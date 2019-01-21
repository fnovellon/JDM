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
  MatAutocompleteTrigger,
  MAT_DIALOG_DATA,
  MatPaginator} from '@angular/material';
import {Observable, of} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap, map, startWith, filter, debounce, first} from 'rxjs/operators';
import {AssocWord} from '../assocWord';
import {Word} from '../word';
import {TooltipPosition} from '@angular/material';


// Services
import { AssociationsJsonService, AssociationData} from '../associations-json.service';
import { ApiService } from '../api.service';



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
  filteredAssociations: Observable<AssociationData[]>;
  splitted: string[] = [];

  // Associations pour l'auto complete
  allAssociations: AssociationData[] = [];
  associations: AssociationData[] = [];
  currentValue = '';

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
  @ViewChild('associationInput', { read: MatAutocompleteTrigger })
  autoComplete: MatAutocompleteTrigger;

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


    // Get associations from JSON
    this.associationsJsonService.getJSON().subscribe(data => {
      data.forEach(assoc => {
        if (assoc.state !== -1) {
          this.allAssociations.push(assoc);
          if (assoc.state === 1) {
            this.preferences.push(assoc);
          }
        }
      });

      // Observable for autocomplete
      //  distinctUntilChanged(),
      this.filteredAssociations = this.associationCtrl.valueChanges.pipe(
        debounceTime(600),
        startWith(''),
        map((value: string) => this._filter(value))
      );
    });

    this.requestForAssoc([]);
  }

  // Scroll
  ngAfterViewInit() {
    this.elementPosition = this.menuElement.nativeElement.offsetTop;
  }

  private _filter(value: string|AssociationData): AssociationData[] {
    console.log('filter : ');
    console.log(value);
    let filterValue = '';
    if (typeof value === 'string') {
      console.log('isString');
      filterValue = value;
      console.log(filterValue);
    } else {
      console.log('isObject');
      filterValue = value.name;
      console.log(filterValue);
    }
    this.currentValue = filterValue;
    return this.allAssociations.filter(option => {
      const strOption = option.name + '#' + option.name_fr;
      return strOption.toLowerCase().includes(filterValue.toLocaleLowerCase());
    });
  }

  requestForAssoc(associations: AssociationData[]): void {
    this.showSpinner = true;
    if (this.resultAssoc == null && associations.length === 0) {
      this.apiService.getWord(this.wordParam, []).subscribe((word) => {
        this.resultAssoc = word;
        this.showSpinner = false;
      });
    } else if (this.resultAssoc != null && associations.length > 0) {
      const relToRequest: AssociationData[] = associations.filter((assoc) => {
        return typeof this.resultAssocData[assoc.id] === 'undefined';
      });
      console.log('requestForAssoc');
      console.log(relToRequest);
      if (relToRequest.length > 0) {
        this.apiService.getWord(this.wordParam, relToRequest).subscribe((word) => {
          console.log('requestForAssoc');
          console.log(word);

          relToRequest.forEach((assoc) => {
            if (word.relations_sortantes[assoc.id] !== undefined) {
              this.resultAssoc.relations_sortantes[assoc.id] = word.relations_sortantes[assoc.id];
            }
            this.pageObject[assoc.id] = {'page': 0, 'size': 18};
            this.getData({pageIndex: 0, pageSize: 18}, assoc.id);
          });
          console.log('Fin OnInit');
          this.showSpinner = false;
        });
      }
    }
  }

  private updateAutocompleteView(value: string) {
    this.associationInput.nativeElement.value = value;
    this.associationCtrl.setValue(value);
    this.associationInput.nativeElement.blur();
  }

  addToAssoc(assoc: AssociationData) {
    if (this.selectedAssociation.indexOf(assoc) === -1) {
      this.selectedAssociation.push(assoc);
    }
    const indexPref = this.preferences.indexOf(assoc);
    const indexAll = this.allAssociations.indexOf(assoc);
    if (indexPref !== -1 && indexAll !== -1 ) {
      this.preferences.splice(indexPref, 1);
      this.allAssociations.splice(indexAll, 1);
      this.updateAutocompleteView(this.currentValue);
      this.showSpinner = true;
      this.requestForAssoc([assoc]);
    }
  }

  removeAssocSelected(assoc: AssociationData) {
    const index = this.selectedAssociation.indexOf(assoc);
    if (index !== -1 ) {
      this.selectedAssociation.splice(index, 1);
      this.allAssociations.push(assoc);
      this.allAssociations.sort(this.compareAssociations);
      this.updateAutocompleteView(this.currentValue);
      if (assoc.state === 1) {
        this.preferences.push(assoc);
        this.preferences.sort(this.compareAssociations);
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
    console.log(event);
    console.log('currentValue : ' + this.currentValue);
    const selectedAssoc: AssociationData = event.option.value;
    if (this.selectedAssociation.indexOf(selectedAssoc) === -1) {
      console.log('existe pas');
      this.selectedAssociation.push(selectedAssoc);
    }
    console.log('selectedAssoc : ' + selectedAssoc.name);
    const indexAll = this.allAssociations.indexOf(selectedAssoc);
    if (indexAll !== -1 ) {
      if (selectedAssoc.state === 1) {
        const indexPref = this.preferences.indexOf(selectedAssoc);
        if (indexPref !== -1) {
          this.preferences.splice(indexPref, 1);
        }
      }
      this.allAssociations.splice(indexAll, 1);
      this.showSpinner = true;
      this.requestForAssoc([selectedAssoc]);
    }
    this.updateAutocompleteView(this.currentValue);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ModalAssociationComponent, {
      width: '80%',
      data: {choicesAssociations: JSON.parse(JSON.stringify(this.allAssociations))}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('dialogClosed : ');
      if (result !== undefined) {
        const assocReturned: AssociationData[] = result;
        assocReturned.forEach((assoc: AssociationData) => {
          console.log('assoc in foreach');
          console.log(this.allAssociations);
          console.log(assoc);
          const index = this.allAssociations.findIndex((item) => {
            return item.id === assoc.id;
          });
          console.log('index : ' + index);
          if (index !== -1) {
            if (assoc.state === 1) {
              const indexPref = this.preferences.findIndex((item) => {
                return item.id === assoc.id;
              });
              console.log('indexPref : ' + indexPref);
              if (indexPref !== -1) {
                this.preferences.splice(indexPref, 1);
              }
            }
            this.allAssociations.splice(index, 1);
            this.selectedAssociation.push(assoc);
          }
        });
        this.requestForAssoc(assocReturned);
        console.log('After add new assoc');
        console.log(this.selectedAssociation);
        this.updateAutocompleteView('');
      }
    });
  }

  private compareAssociations(a: AssociationData, b: AssociationData) {
    return a.id - b.id;
  }

  searchNewWord($event) {
    const selectedWord = $event.word;
    console.log('searchNewWord : ' + selectedWord);
    // TODO: try to search how reload a component or do reload by yourself
  }
}

export interface DialogData {
  choicesAssociations: AssociationData[];
  returnAssociations: AssociationData[];
}

@Component({
  selector: 'app-modal-association',
  templateUrl: 'modal-association.html',
  styleUrls: ['./modal-association.css']
})
export class ModalAssociationComponent implements OnInit {

  associations: AssociationData[] = [];

  constructor(public dialogRef: MatDialogRef<ModalAssociationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  onNoClick(): void {
    console.log('close');
    this.dialogRef.close();
  }

  ngOnInit() {
    this.associations = this.data.choicesAssociations;
    this.data.returnAssociations = [];
  }

  selectedItem(itemAssoc: AssociationData) {
    this.data.returnAssociations.push(itemAssoc);

    const index = this.associations.indexOf(itemAssoc);
    if (index !== -1) {
      this.associations.splice(index, 1);
    }
    this.data.returnAssociations = this.data.returnAssociations;
  }

  removeSelection(doc: AssociationData) {
    const index = this.data.returnAssociations.indexOf(doc);
    if (index !== -1) {
      this.data.returnAssociations.splice(index, 1);
    }
    this.associations.push(doc);
    this.associations.sort(this.compareAssociations);
  }

  private compareAssociations(a: AssociationData, b: AssociationData) {
    return a.id - b.id;
  }

}
