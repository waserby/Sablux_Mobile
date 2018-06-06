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
import { ContactPageModule } from '../pages/contact/contact.module';

//Pages
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { ListeProgrammesPage } from '../pages/liste-programmes/liste-programmes';
import { TrouverBienPage } from '../pages/trouver-bien/trouver-bien';
import { ResultatRecherchePage } from '../pages/resultat-recherche/resultat-recherche';
import { ContactPage } from '../pages/contact/contact';

//Native
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { EmailComposer } from '@ionic-native/email-composer';
import { CallNumber } from '@ionic-native/call-number';
import { OneSignal } from '@ionic-native/onesignal';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { BackgroundMode } from '@ionic-native/background-mode';
import { InAppBrowser } from '@ionic-native/in-app-browser';

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
    ResultatRecherchePageModule,
    ContactPageModule
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    ListeProgrammesPage,
    TrouverBienPage,
    ResultatRecherchePage,
    ContactPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    EmailComposer,
    CallNumber,
    OneSignal,
    LocalNotifications,
    BackgroundMode,
    InAppBrowser
  ]
})
export class AppModule {}
