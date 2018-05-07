import { NgModule } from '@angular/core';
import { ProgrammesPartialComponent } from './programmes-partial/programmes-partial';
import { IonicModule } from 'ionic-angular';// ADD: A ajouter quand je veux utiliser le html de ionic dans un nouveau module
import { GoogleMaps } from '@ionic-native/google-maps';// 2_ADD: For MAP

//Services, Providers
import { ProgsProvider } from '../providers/progs/progs';
import { ProgsService } from '../providers/services/progs.service';
import { GooglemapPartialComponent } from './googlemap-partial/googlemap-partial';

@NgModule({
	declarations: [ProgrammesPartialComponent,
    GooglemapPartialComponent],
	imports: [IonicModule],//ADD: A ajouter AUSSI
	exports: [ProgrammesPartialComponent,
    GooglemapPartialComponent],
	providers: [
		ProgsProvider,
		ProgsService,
		GoogleMaps
	  ]
})
export class ComponentsModule {}
