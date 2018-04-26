import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

//Pages
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { SlidesPage } from '../pages/slides/slides';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;// Page principale
  loader: any;

  pages: Array<{title: string, component: any}>;

  constructor (public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public loadingCtrl: LoadingController, public storage: Storage) {
    this.initializeApp();

    // LA LISTE DES PAGES used for an example of ngFor and navigation
    this.pages = [
      { title: 'Programmes', component: HomePage },
      { title: 'Liste', component: ListPage }
    ];

  }// FIN CONSTRUCTEUR

  //La méthode d'initialisation 
  initializeApp() {
    this.presentLoading();//Affiche le loading
    this.platform.ready().then(() => {
    
      //Pour montrer le Slide une seule fois
      this.storage.get('slideshow').then((result) => {

        if(result==='dejaouvert')
        {//Si les slides ont déja été montrés, 

          this.rootPage = HomePage;
          console.log("Slide déja montré");

        } else {// Si SlidesPage n'est pas encore montré, on montre et on passe la variable a déja montré et on met rootPage a HomePage pour la prochaine connexion
          this.rootPage = "SlidesPage";
          this.storage.set('slideshow', "dejaouvert");
          console.log("Slide");
        }
 
        this.loader.dismiss();
 
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
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
