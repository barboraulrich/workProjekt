import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {DashboardComponent} from './dashboard/dashboard.component';

export const routes: Routes = [


  { path: '', component: DashboardComponent},
];

@NgModule({
  imports: [],
  exports: [RouterModule],
})
export class AppRoutingModule {}
