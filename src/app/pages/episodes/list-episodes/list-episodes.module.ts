import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListEpisodesPageRoutingModule } from './list-episodes-routing.module';

import { ListEpisodesPage } from './list-episodes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListEpisodesPageRoutingModule
  ],
  declarations: [ListEpisodesPage]
})
export class ListEpisodesPageModule {}
