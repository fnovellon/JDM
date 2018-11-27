import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Our components
import { SearchComponent } from './search/search.component';
import { ResultComponent } from './result/result.component';
import { PreferenceComponent } from './preference/preference.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/search',
    pathMatch: 'full'
  },
  {
    path: 'search',
    component: SearchComponent
  },
  {
    path: 'preferences',
    component: PreferenceComponent
  },
  {
    path: 'results',
    component: ResultComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
