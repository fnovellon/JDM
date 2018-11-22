import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule, MatToolbarModule, MatMenuModule, MatIconModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule } from '@angular/material';

import { AppComponent } from './app.component';
import { PreferenceComponent } from './preference/preference.component';
import { ResultComponent } from './result/result.component';
import { SearchComponent } from './search/search.component';
import { SearchToolbarComponent } from './search-toolbar/search-toolbar.component';
import { BasicToolbarComponent } from './basic-toolbar/basic-toolbar.component';

@NgModule({
  declarations: [
    AppComponent,
    PreferenceComponent,
    ResultComponent,
    SearchComponent,
    SearchToolbarComponent,
    BasicToolbarComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
