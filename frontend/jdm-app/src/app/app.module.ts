import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule,
  MatGridListModule,
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
  MatCardModule,
  MatPaginatorModule,
  MatSortModule,
  MatDividerModule,
  MatTooltipModule } from '@angular/material';

import { AppComponent } from './app.component';
import { PreferenceComponent } from './preference/preference.component';
import { ResultComponent, ModalAssociation } from './result/result.component';
import { SearchComponent } from './search/search.component';
import { ResultToolbarComponent } from './result-toolbar/result-toolbar.component';
import { BasicToolbarComponent } from './basic-toolbar/basic-toolbar.component';
import { ScrollToolbarComponent } from './scroll-toolbar/scroll-toolbar.component';
import { PreferenceToolbarComponent } from './preference-toolbar/preference-toolbar.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    PreferenceComponent,
    ResultComponent,
    SearchComponent,
    ResultToolbarComponent,
    BasicToolbarComponent,
    ScrollToolbarComponent,
    ModalAssociation,
    PreferenceToolbarComponent
  ],
  imports: [
    AppRoutingModule,
    HttpClientModule,
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
    MatGridListModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatDividerModule,
    MatTooltipModule
  ],
  providers: [CookieService ],
  bootstrap: [AppComponent],
  entryComponents: [
        ModalAssociation
  ]
})
export class AppModule { }
