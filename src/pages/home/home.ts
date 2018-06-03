import { Component } from '@angular/core';
import { NavController, ItemSliding, Item, AlertController, Platform } from 'ionic-angular';
//Pages
import { ListeProgrammesPage } from '../liste-programmes/liste-programmes';
import { TrouverBienPage } from '../trouver-bien/trouver-bien';
import { ContactPage } from '../contact/contact';
import { CallNumber } from '@ionic-native/call-number';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { CordovaOptions } from '@ionic-native/core';
import { global } from '../../mocks/global';// VARIABLE GLOBALE
import { Subscription } from 'rxjs';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  activeItemSliding: ItemSliding = null;
  numeroSablux ="338694000";
  event : Subscription;

  constructor(public platform: Platform, private alertCtrl: AlertController, private localNotifications: LocalNotifications, public alertController: AlertController, public callNumber: CallNumber, public navCtrl: NavController) {
  //TRAITEMENT quand on clique une notif (Je l'ai mis ici car c'est la page qui est lancer en première)
    this.platform.ready().then(() => {
      //J'ai une variable globale que je met à true quand je notifie (Dans la page Filtre-partial )
      //if(global.skipLocalNotificationReady = true){// Si j'ai notifier alors 
        //this.localNotifications.fireQueuedEvents();//J'execute manuellement les events de locals notifs (dans mon cas c'et le onclick)
       // global.skipLocalNotificationReady = false;
      //}
      //TODO quand on clique une notif
      let event = this.localNotifications.on('click').subscribe( notification => {
        //Ca lance une alerte avec un bouton menant vers la notification
        let alert = alertCtrl.create({
          title: notification.title,
          subTitle: notification.text,
          buttons: [{
            text: 'Voir',
            handler: () => {
              //TODO quand on clique une notif LOCAL
              this.sendInputs({datafiltre: {zone: notification.data.zone, type: notification.data.typeproduit, prix: notification.data.price}});       
            }
          }]
        });
        alert.present();
      })
    })//PLATFORM READY
  }

  ionViewWillLeave(){
    // this.eventConnect.unsubscribe();
    console.log('ionViewWillLeave HOME byeee');

  }

  ionViewDidLeave(){
    //this.event.unsubscribe();
    console.log('ionViewDidLeave HOME byeee');
  }

  //----------Methode pour que le itemsliding fasse le move de slide quand on clique dessus----------
  public openOption(itemSlide: ItemSliding, item: Item, test: String) {
    console.log('opening item slide..');
    
    if(this.activeItemSliding!==null) //use this if only one active sliding item allowed
     this.closeOption();
 
    this.activeItemSliding = itemSlide;
    let swipeAmount;
    if(test=='biens'){
      swipeAmount = 259; //set your required swipe amount
    }else if(test=='contact')
    {
      swipeAmount = 184;
    }else{
      swipeAmount = 176;
    }

    itemSlide._setOpenAmount(swipeAmount, false) ;
    console.log(itemSlide.getOpenAmount());
   }

   public closeOption() {
    console.log('closing item slide..');
 
    if(this.activeItemSliding) {
     this.activeItemSliding.close();
     this.activeItemSliding = null;
    }
   }

//    public close(item: ItemSliding) {//Pour faire le slide back 
//     item.close();
//     item.setElementClass("active-sliding", false);
//     item.setElementClass("active-slide", false);
//     item.setElementClass("active-options-right", false);
// }

//------------FIN METHODES SLIDING BUTTONS---------------

//Methode pour ouvrir les programmes réalisés, en cours ou a venir selon le bouton clicquer
  openListeProgrammes(valeur: any){ // On recupère le type de programme et on envoi à la page concernée
    this.navCtrl.push(ListeProgrammesPage, valeur);
    //{typeDeProgramme: 'rea'}
  }
//Methode pour ouvrir la page recherche bien
  openTrouverBien(valeur: any){ // On recupère le statut (louer/vendre)
    this.navCtrl.push(TrouverBienPage, valeur);
  }
//Methode pour ouvrir l
  openContact(valeur: any){ // On recupère le statut (louer/vendre)
    this.navCtrl.push(ContactPage, valeur);
  }

  //Fonction d'appel 
  openPhone(numero: string) {
    this.callNumber.callNumber(numero, true)
      .then(() => console.log('Phone ouvert'))
      .catch(() => {
        this.alertMessage('Impossible d\'utiliser le phone' , "L\'application n'a pas réussi à ouvrir le phone");
      });  
  }

  //Alerte
  alertMessage(title, detail) {
    let alert = this.alertController.create({
      title: title.toString(),
      subTitle: detail.toString(),
      buttons: ['Fermer']
    });
    alert.present();
  }

  //Methode de VALIDATION DU FORMULAIRE
  sendInputs(valeur) {
    this.navCtrl.push('page-resultat-recherche', valeur);//J'envoi la valeur à travers un navCTRL
  }
}
