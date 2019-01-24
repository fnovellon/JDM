import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Our components
import { SearchComponent } from './search/search.component';
import { ResultComponent } from './result/result.component';
import { PreferenceComponent } from './preference/preference.component';
import { ErrorComponent } from './error/error.component';

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
    path: 'results/:word',
    component: ResultComponent
  },
  {
    path: '404',
    component: ErrorComponent
  },
  {
    path: '**',
    redirectTo: '/404',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
