import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrouverBienPage } from './trouver-bien';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    TrouverBienPage,
  ],
  imports: [
    IonicPageModule.forChild(TrouverBienPage),
    ComponentsModule
  ],
})
export class TrouverBienPageModule {}
