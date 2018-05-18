import { NgModule } from '@angular/core';
import { ProgrammesPartialComponent } from './programmes-partial/programmes-partial';
import { IonicModule } from 'ionic-angular';// ADD: A ajouter quand je veux utiliser le html de ionic dans un nouveau module
import { GoogleMaps } from '@ionic-native/google-maps';// 2_ADD: For MAP
import { HttpClientModule } from '@angular/common/http';


//Services, Providers
import { ProgsProviderFireApi } from '../providers/progs/progs';
import { ProgsService } from '../providers/services/progs.service';
import { GooglemapPartialComponent } from './googlemap-partial/googlemap-partial';
import { Network } from '@ionic-native/network';

@NgModule({
	declarations: [ProgrammesPartialComponent,
    GooglemapPartialComponent],
	imports: [IonicModule, HttpClientModule],//ADD: A ajouter AUSSI
	exports: [ProgrammesPartialComponent,
    GooglemapPartialComponent],
	providers: [
		ProgsProviderFireApi,
		ProgsService,
		GoogleMaps,
		Network
	  ]
})
export class ComponentsModule {}
