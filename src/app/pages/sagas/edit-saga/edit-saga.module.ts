import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditSagaPageRoutingModule } from './edit-saga-routing.module';

import { EditSagaPage } from './edit-saga.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EditSagaPageRoutingModule
  ],
  declarations: [EditSagaPage]
})
export class EditSagaPageModule {}
