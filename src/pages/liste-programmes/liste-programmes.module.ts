import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListeProgrammesPage } from './liste-programmes';

//Modules
import { ComponentsModule } from '../../components/components.module';


@NgModule({
  declarations: [
    ListeProgrammesPage,
  ],
  imports: [
    IonicPageModule.forChild(ListeProgrammesPage),
    ComponentsModule
  ],
})
export class ListeProgrammesPageModule {}
