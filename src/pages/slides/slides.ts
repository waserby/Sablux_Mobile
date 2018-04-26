import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';

/**
 * Generated class for the SlidesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-slides',
  templateUrl: 'slides.html',
})

export class SlidesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SlidesPage');
  }

  slides = [
    {
      title: "Bienvenue sur votre application réservée à l'immobilier!",
      description: "Vous pouvez obtenir des informations sur nos nouveaux programmes et services, rechercher un appartement ou encore envoyer un retour à Sablux",
      image: "assets/img/sablier.jpg",
    },
    {
      title: "C'est quoi Sablux?",
      description: "<b>Sablux</b> est une entreprise <b>100% sénégalaise</b> constituée de quatre branches spécialisées dans <b>l'achat</b>, <b>la vente</b> et <b>la gestion</b> de biens immobiliers.",
      image:"assets/img/logo.png"
    }
  ];


  startApp() {
    this.navCtrl.setRoot(HomePage, {}, {
      animate: true,
      direction: 'forward'
    });
  }
}
 