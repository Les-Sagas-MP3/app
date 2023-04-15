import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlayEpisodePage } from './play-episode.page';

const routes: Routes = [
  {
    path: '',
    component: PlayEpisodePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayEpisodePageRoutingModule {}
