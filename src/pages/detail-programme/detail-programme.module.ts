import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailProgrammePage } from './detail-programme';

@NgModule({
  declarations: [
    DetailProgrammePage,
  ],
  imports: [
    IonicPageModule.forChild(DetailProgrammePage)
  ],
})
export class DetailProgrammePageModule {}
