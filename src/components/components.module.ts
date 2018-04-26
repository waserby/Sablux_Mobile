import { NgModule } from '@angular/core';
import { ProgrammesPartialComponent } from './programmes-partial/programmes-partial';
import { IonicModule } from 'ionic-angular';// ADD: A ajouter quand je veut utiliser le html de ionic dans un nouveau module

@NgModule({
	declarations: [ProgrammesPartialComponent],
	imports: [IonicModule],//ADD: A ajouter AUSSI
	exports: [ProgrammesPartialComponent]
})
export class ComponentsModule {}
