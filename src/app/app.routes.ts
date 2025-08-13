import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {DashboardModule} from './dashboard/dashboard.module';

export const routes: Routes = [

  {
    path: '',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  }
];

@NgModule({
  imports: [],
  exports: [RouterModule],
})
export class AppRoutingModule {}
