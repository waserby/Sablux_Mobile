import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailProgrammePage } from './detail-programme';
import { ComponentsModule } from '../../components/components.module';



@NgModule({
  declarations: [
    DetailProgrammePage,
  ],
  imports: [
    IonicPageModule.forChild(DetailProgrammePage),
    ComponentsModule
  ],
})
export class DetailProgrammePageModule {}
