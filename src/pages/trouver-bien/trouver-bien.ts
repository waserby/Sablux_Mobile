import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TrouverBienPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-trouver-bien',
  templateUrl: 'trouver-bien.html',
})
export class TrouverBienPage implements OnInit{
  statut: String;

  //METHODES LIFECYCLE
    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }
    
    ngOnInit(): void {
      this.statut = this.navParams.get('statutBien'); //On recupère le type de programme choisi et on stocke;
    }

    ionViewDidLoad() {
      console.log('ionViewDidLoad TrouverBienPage');
    }
  //METHODES LOGIQUE METIER

}
