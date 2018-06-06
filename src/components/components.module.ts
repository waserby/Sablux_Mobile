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
import { FiltrePartialComponent } from './filtre-partial/filtre-partial';
import { ResultatListPartialComponent } from './resultat-list-partial/resultat-list-partial';
import { ResultatMapPartialComponent } from './resultat-map-partial/resultat-map-partial';
import { EmailComposer } from '@ionic-native/email-composer';
import { CallNumber } from '@ionic-native/call-number';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { BackgroundMode } from '@ionic-native/background-mode';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@NgModule({
	declarations: [ProgrammesPartialComponent,
    GooglemapPartialComponent,
    FiltrePartialComponent,
    ResultatListPartialComponent,
    ResultatMapPartialComponent],
	imports: [IonicModule, HttpClientModule],//ADD: A ajouter AUSSI
	exports: [ProgrammesPartialComponent,
    GooglemapPartialComponent,
    FiltrePartialComponent,
    ResultatListPartialComponent,
    ResultatMapPartialComponent],
	providers: [
		ProgsProviderFireApi,
		ProgsService,
		GoogleMaps,
		Network,
		EmailComposer,
		CallNumber,
		LocalNotifications,
		BackgroundMode,
		InAppBrowser
	  ]
})
export class ComponentsModule {}
