//Modules
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { ComponentsModule } from '../components/components.module';
import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import { FIREBASE_CONFIG } from './firebase.credentials';
//Modules des pages ajoutées
import { TrouverBienPageModule } from '../pages/trouver-bien/trouver-bien.module';
import { ResultatRecherchePageModule } from '../pages/resultat-recherche/resultat-recherche.module';
import { ListeProgrammesPageModule } from '../pages/liste-programmes/liste-programmes.module'; //Module d'une Page

//Pages
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { ListeProgrammesPage } from '../pages/liste-programmes/liste-programmes';
import { TrouverBienPage } from '../pages/trouver-bien/trouver-bien';
import { ResultatRecherchePage } from '../pages/resultat-recherche/resultat-recherche';

//Native
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(), //Pour le Storage
    ListeProgrammesPageModule,
    TrouverBienPageModule,
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireDatabaseModule,
    ComponentsModule,
    ResultatRecherchePageModule
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    ListeProgrammesPage,
    TrouverBienPage,
    ResultatRecherchePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {}
