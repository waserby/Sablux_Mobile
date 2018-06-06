import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FiltrePartialComponent } from '../../components/filtre-partial/filtre-partial';
import { Storage as Store } from '@ionic/storage';

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
  @ViewChild(FiltrePartialComponent) childFiltre: FiltrePartialComponent;
  statut: String;

  //METHODES LIFECYCLE
    constructor(public storage: Store, public navCtrl: NavController, public navParams: NavParams) {
    }
    
    ngOnInit(): void {
      this.statut = this.navParams.get('statutBien'); //On recupère le type de programme choisi et on stocke;
    }

    ionViewDidLoad() {
      console.log('ionViewDidLoad TrouverBienPage');
      // this.storage.set('stockerOK', false);// Je met la variable à true
      // this.storage.get('stockerOK').then(data => {console.log(" stockerOK : "+data);});
    }

    ionViewWillLeave(){
      //En quittant l a page je unsunscribe les subscribes effectué
      // this.eventConnect.unsubscribe();
      console.log('ionViewWillLeave TrouverBienPage byeee');
      this.childFiltre.eventConnect.unsubscribe();
      console.log("UNSUBSCRIBE DONE FOR CONNECT");
      this.childFiltre.eventDisconnect.unsubscribe();
      console.log("UNSUBSCRIBE DONE FOR DISCONNECT");
      this.childFiltre.eventNotifFiltre.unsubscribe();
      console.log("UNSUBSCRIBE DONE FOR NOTIFFILTRE");
    }
  
  //METHODES LOGIQUE METIER

}
