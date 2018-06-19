import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { FiltrePartialComponent } from '../../components/filtre-partial/filtre-partial';
import { Storage as Store } from '@ionic/storage';
import { Subscription } from 'rxjs';
import { LocalNotifications } from '@ionic-native/local-notifications';

/**
 * Generated class for the TrouverBienPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage(
  {
  name: 'page-trouver-bien'
  }
)

@Component({
  selector: 'page-trouver-bien',
  templateUrl: 'trouver-bien.html',
})
export class TrouverBienPage implements OnInit{
  @ViewChild(FiltrePartialComponent) childFiltre: FiltrePartialComponent;
  statut: String;
  eventNotifFiltre : Subscription;


  //METHODES LIFECYCLE
    constructor(private alertCtrl: AlertController, private localNotifications: LocalNotifications, public storage: Store, public navCtrl: NavController, public navParams: NavParams, private plt: Platform) {
    }
    
    ngOnInit(): void {
      this.statut = this.navParams.get('statutBien'); //On recupère le type de programme choisi et on stocke;
    }

    ionViewDidLoad() {
      console.log('ionViewDidLoad TrouverBienPage');
      // this.storage.set('stockerOK', false);// Je met la variable à true
      // this.storage.get('stockerOK').then(data => {console.log(" stockerOK : "+data);});
    }

    // ionViewWillLeave(){
    //   //En quittant l a page je unsunscribe les subscribes effectué
    //   // this.eventConnect.unsubscribe();
    //   console.log('ionViewWillLeave TrouverBienPage byeee');
    //   this.childFiltre.eventConnect.unsubscribe();
    //   console.log("UNSUBSCRIBE DONE FOR CONNECT");
    //   this.childFiltre.eventDisconnect.unsubscribe();
    //   console.log("UNSUBSCRIBE DONE FOR DISCONNECT");
      
    //   this.eventNotifFiltre.unsubscribe();
    //   console.log("UNSUBSCRIBE DONE FOR NOTIFFILTRE Trouver Bien");
    // }

    ionViewDidEnter(){
      console.log("Entrer TROUVER BIENN");
      this.plt.ready().then(() => {
        //TODO quand on clique une notif
        this.eventNotifFiltre = this.localNotifications.on('click').subscribe( notification => {
          //Ca lance une alerte avec un bouton menant vers la notification
          let alert = this.alertCtrl.create({
            title: notification.title,
            subTitle: notification.text,
            buttons: [{
              text: 'Voir',
              handler: () => {
                //TODO quand on clique une notif LOCAL
                this.sendInputs({zone: notification.data.zone, type: notification.data.typeproduit, prix: notification.data.price});       
              }
            }]
          });
          alert.present();
        })
      })//PLATFORM READY
    }
  
  //METHODES LOGIQUE METIER
    //Methode de VALIDATION DU FORMULAIRE
    sendInputs(valeur) {
      this.navCtrl.push('page-resultat-recherche', valeur);//J'envoi la valeur à travers un navCTRL
    }
}
