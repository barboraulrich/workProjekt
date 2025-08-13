import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {DashboardComponent} from './dashboard.component';

@NgModule({
  declarations: [],
  imports: [

    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
      },
    ]),
    CommonModule,

  ],
  exports: [],
  providers: [],
})
export class DashboardModule {}
