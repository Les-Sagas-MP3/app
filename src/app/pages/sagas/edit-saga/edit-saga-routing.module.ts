import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditSagaPage } from './edit-saga.page';

const routes: Routes = [
  {
    path: '',
    component: EditSagaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditSagaPageRoutingModule {}
