import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListEpisodesPage } from './list-episodes.page';

const routes: Routes = [
  {
    path: '',
    component: ListEpisodesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListEpisodesPageRoutingModule {}
