import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatGridListModule, MatCheckboxModule, MatToolbarModule, MatMenuModule, MatIconModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule, MatChipsModule, MatTableModule, MatDialogModule } from '@angular/material';

import { AppComponent } from './app.component';
import { PreferenceComponent } from './preference/preference.component';
import { ResultComponent } from './result/result.component';
import { SearchComponent } from './search/search.component';
import { SearchToolbarComponent } from './search-toolbar/search-toolbar.component';
import { BasicToolbarComponent } from './basic-toolbar/basic-toolbar.component';
import { ScrollToolbarComponent } from './scroll-toolbar/scroll-toolbar.component';
import { AssociationComponent, ModalAssociation } from './association/association.component';

@NgModule({
  declarations: [
    AppComponent,
    PreferenceComponent,
    ResultComponent,
    SearchComponent,
    SearchToolbarComponent,
    BasicToolbarComponent,
    ScrollToolbarComponent,
    AssociationComponent,
    ModalAssociation 
  ],
  imports: [
    FormsModule,
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatTableModule,
    MatDialogModule,
    MatGridListModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
        ModalAssociation
  ]
})
export class AppModule { }
