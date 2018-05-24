import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResultatRecherchePage } from './resultat-recherche';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ResultatRecherchePage,
  ],
  imports: [
    IonicPageModule.forChild(ResultatRecherchePage),
    ComponentsModule
  ],
})
export class ResultatRecherchePageModule {}
