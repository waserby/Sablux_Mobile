import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController, NavController, AlertController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { OneSignal } from '@ionic-native/onesignal';
import { BackgroundMode } from '@ionic-native/background-mode';

//Pages
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { SlidesPage } from '../pages/slides/slides';
import { ListeProgrammesPage } from '../pages/liste-programmes/liste-programmes';
import { TrouverBienPage } from '../pages/trouver-bien/trouver-bien';
import { ContactPage } from '../pages/contact/contact';
import { InAppBrowserOptions, InAppBrowser } from '@ionic-native/in-app-browser';
import { Page } from 'ionic-angular/navigation/nav-util';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage; // Page principale
  loader: any;
  activePage: any;
  pages: Array<{title: string, component: any, icone: string}>;

  constructor (public events: Events, private iab: InAppBrowser, private backgroundMode: BackgroundMode, private oneSignal : OneSignal, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public loadingCtrl: LoadingController, public storage: Storage) {
    this.initializeApp();
    this.backgroundMode.enable();//L'application continue à tourner même en BACKGROUND
    
    //Evenement pour les cases actives du menu
    events.subscribe('open:menu', (indicePage) => {
      console.log('Welcome '+indicePage);
      this.activePage = this.pages[indicePage];
    });

    // LA LISTE DES PAGES used for an example of ngFor and navigation
    this.pages = [
      { title: 'Accueil', component: HomePage, icone:'home' }, // Pas de HomePage car ca crée des repetitions sur les alertes lancées
      //{ title: 'Liste', component: ListPage },
      { title: 'Nos programmes immobiliers', component: ListeProgrammesPage, icone:'grid' },
      { title: 'Trouver un bien immobilier', component: TrouverBienPage, icone:'search' },
      { title: 'Espace membre', component: TrouverBienPage, icone:'person' },
      { title: 'Contacter SABLUX', component: ContactPage, icone:'contacts' }

    ];
    this.activePage = this.pages[0];

    //ONESGINAL pour Notifications à distance
      this.oneSignal.startInit('3a0b8b5b-9ef2-431f-bb19-046403dea55c', '549400626727'); //First: APP id oneSignal Second: Identifiant de l'expediteur

      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

      this.oneSignal.handleNotificationReceived().subscribe(() => {
      // do something when notification is received
      });

      this.oneSignal.handleNotificationOpened().subscribe((data) => {
        // do something when a notification is opened
        let action = data.notification.payload.additionalData.action;//Je récupère la data additionelle dans le push
        
        if(action == 'rechargeApi') {//si il ya de nouveau produits, je met a false donc les prgorammes seront rechargés
          //this.storage.get('stockerBool').then(data => { alert(data) });
          this.storage.set('stockerBool', false);// Je met la variable à false pour que les services soient rechargés
          this.nav.push(TrouverBienPage);// JE vais voir sur la page
          // this.presentLoading();
          // setTimeout(() => {
          //   this.loader.dismiss();
          //   this.storage.set('stockerBool', false);// Je met la variable à false
          //   this.nav.push(TrouverBienPage);// JE vais voir sur la page
          // }, 3000);// 2 HEURES 7200000

        } else if ((action == 'realiser') || (action == 'cours') || (action == 'venir')) {
          
          let valeur = {typeDeProgramme: action };
          this.nav.push(ListeProgrammesPage, valeur);
        
        } else {
          
          alert ("L'action est inconnu : "+action);
        
        }
      });// Fin traitement on click notification

      this.oneSignal.endInit();

  }// FIN CONSTRUCTEUR

  //La méthode d'initialisation 
  initializeApp() {
    this.presentLoading();//Affiche le loading
    this.platform.ready().then(() => {
    
      //Pour montrer le Slide une seule fois
      this.storage.get('ifslides').then((result) => {

        if(result==='dejaouvert')
        {//Si les slides ont déja été montrés, 

          this.rootPage = HomePage;
          console.log("Slide déja montré");

        } else {// Si SlidesPage n'est pas encore montré, on montre et on passe la variable a déja montré et on met rootPage a HomePage pour la prochaine connexion
          this.rootPage = "SlidesPage";
          this.storage.set('ifslides', "dejaouvert");
          console.log("Slide");
        }
 
        this.loader.dismiss();// On fait disparaitre le loader
 
      });
    });

    // Okay, so the platform is ready and our plugins are available.
    // Here you can do any higher level native things you might need.
    this.statusBar.styleDefault();
    this.splashScreen.hide();
  }

  //Le loading pendant que ca charge
  presentLoading() {
 
    this.loader = this.loadingCtrl.create({
      content: "Chargement..."
    });
 
    this.loader.present();

  }

  openPage(page) {
    //Ouvrir une page
    if (page.title == 'Espace membre') {

      this.openBrowser('http://espace-sablux.technosmartsn.com/'); // Pas de set root car ca amène des actions repetitives

    } else{

      this.nav.setRoot(page.component);

    }
    this.activePage = page; // On set la page active
  }

  checkActive(page) : boolean { //Regarde si la page en paramètre est active et retourne true ou false
    return page == this.activePage;
  }

  //Methode pour ouvrir l'ESPACE
  openBrowser(url: string){ 
    //On definit les options et on donne l'url
    const options: InAppBrowserOptions = {
      zoom:'no',
      location:'no',
      toolbar:'no'
    };
    const browser = this.iab.create(url,'_self',options);
    browser.show();
  }

}
