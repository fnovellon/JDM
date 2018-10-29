import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'preference',
    loadChildren: './preference/preference.module#PreferenceModule'
  },
  {
    path: 'result',
    loadChildren: './result/result.module#ResultModule'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
