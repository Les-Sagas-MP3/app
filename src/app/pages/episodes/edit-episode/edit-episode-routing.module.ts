import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditEpisodePage } from './edit-episode.page';

const routes: Routes = [
  {
    path: '',
    component: EditEpisodePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditEpisodePageRoutingModule {}
