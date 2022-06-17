import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditEpisodePageRoutingModule } from './edit-episode-routing.module';

import { EditEpisodePage } from './edit-episode.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditEpisodePageRoutingModule
  ],
  declarations: [EditEpisodePage]
})
export class EditEpisodePageModule {}
