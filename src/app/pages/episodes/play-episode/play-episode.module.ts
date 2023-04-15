import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlayEpisodePageRoutingModule } from './play-episode-routing.module';

import { PlayEpisodePage } from './play-episode.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlayEpisodePageRoutingModule
  ],
  declarations: [PlayEpisodePage]
})
export class PlayEpisodePageModule {}
