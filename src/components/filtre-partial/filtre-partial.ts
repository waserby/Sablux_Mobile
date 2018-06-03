import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { ProgsProviderFireApi } from '../../providers/progs/progs';
import { Produit } from '../../models/produit-model';
import { ResultatListPartialComponent } from '../resultat-list-partial/resultat-list-partial';
import { ResultatRecherchePage } from '../../pages/resultat-recherche/resultat-recherche';
import { NavController, AlertController, Platform, LoadingController } from 'ionic-angular';
import { global } from '../../mocks/global';// VARIABLE GLOBALE

//Native
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Storage as Store } from '@ionic/storage';
import { ListeProgrammesPage } from '../../pages/liste-programmes/liste-programmes';
import { Network } from '@ionic-native/network';
import { HomePage } from '../../pages/home/home';
import { Subscription } from 'rxjs';

/**
 * Generated class for the FiltrePartialComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'filtre-partial',
  templateUrl: 'filtre-partial.html'
})
export class FiltrePartialComponent implements OnInit {
  @Input() itemStatut: String; // recoit le statut (Louer/Vendre) From Component Parent qui est Trouver-bien
  tabProduits: any;//Tableau de programme LOCAL: string;
  urlProduits: string;
  arrayZone: string[] = []; //Tableau des zone disponible dans les programmes de l'API
  //NG MODEL des inputs
  inputs = { zone: "none", type: "none", prix: 0 };// On initialise pour les default entrie et on recupère en two way databinding
  text: number = 0;//Pour filtre template
  boutonRechercherOn : boolean;
  loader: any; //Loader
  eventConnect : Subscription;
  eventDisconnect : Subscription;

  //METHODES LIFECYCLE
  constructor(public loadingCtrl: LoadingController, private network: Network, private plt: Platform, private alertCtrl: AlertController, public storage: Store, private localNotifications: LocalNotifications, public navCtrl: NavController, private progsServiceFireApi: ProgsProviderFireApi) {
    this.plt.ready().then(() => {
      //TODO quand on clique une notif
      this.localNotifications.on('click').subscribe( notification => {
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
  }// FIN contructeur

  ngOnInit(): void {
    this.urlProduits = 'http://seproerp.ddns.net:82/api/index.php/product/list?api_key=rvz6gy28';
    //Si le phone est déconnecté
    if(this.isOnline()) { 
      //ToDO: Si le phone est online
      this.boutonRechercherOn = true;
      this.presentLoading();//Affiche le loading
      this.restGetProduits();
    } else {
      this.boutonRechercherOn = false;
      
        let alertDecon = this.alertCtrl.create({
          title: "Déconnecté !!",
          subTitle: "Veuillez vous connecter pour accéder aux services",
          buttons: [{
            text: 'Retour',
            handler: () => {
              //TODO quand on clique une notif LOCAL
              this.eventConnect.unsubscribe();
              this.navCtrl.popToRoot();
            }
          }]
        });
        alertDecon.present();
      
    }
    //CHANGE STATE TO CONNECT
    this.eventConnect = this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      this.boutonRechercherOn = true;
      this.presentLoading();//Affiche le loading
      this.restGetProduits();
    });
    //CHANGE STATE TO DISCONNECT
    this.eventDisconnect = this.network.onDisconnect().subscribe(() => {
      this.boutonRechercherOn = false;// Je grise le bouton
      console.log('network disconnected!');
        let alertDecon = this.alertCtrl.create({
          title: "Déconnecté  !!",
          subTitle: "Veuillez vous connecter pour pouvoir effectuer des recherches",
          buttons: [{
            text: 'Retour',
            handler: () => {
              //TODO quand on clique une notificiation LOCAL
              this.navCtrl.pop();
            }
          }]
        });
        alertDecon.present();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Filtre-Partial');
  }


  ionViewDidEnter() {
    console.log('ionViewDidEnter Filtre-Partial');
  }

  ionViewWillLeave(){
    // this.eventConnect.unsubscribe();
    console.log('ionViewWillLeave Filtre-Partial byeee');

  }

  ionViewDidLeave(){
    //this.event.unsubscribe();
    console.log('ionViewDidLeave Filtre-Partial byeee');
  }


  //METHODES LOGIQUE METIER
  //For Api REST
  restGetProduits() {
    this.progsServiceFireApi.restGet(this.urlProduits).then(data => {
      this.tabProduits = data;
      //On store juste au premier lancement de l'application
      this.storage.get('produits').then(donnee => {
        if (!donnee) {
          this.storage.set('produits', this.tabProduits);// Je STORE le tableau de produits pour les notifications        
        }
      })
        .catch(err => {
          console.log('Your data don\'t exist and returns error in catch: ' + JSON.stringify(err));
        });

      this.testNewProgramme(this.tabProduits);//On test si il y'a un nouveau programme

      //Pour les ZONES
      for (let item of this.tabProduits) {
        if ((this.arrayZone.indexOf(item.zone) == -1) && (item.zone !== null) && (item.zone !== "")) { //this.tabProduits.indexOf(item.zone) <= -1 
          this.arrayZone.push(item.zone);
        }
      this.loader.dismiss();// On fait disparaitre le loader
      }
    });
  }

  //Methode de VALIDATION DU FORMULAIRE
  sendInputs(valeur) {
    this.navCtrl.push('page-resultat-recherche', valeur);//J'envoi la valeur à travers un navCTRL
  }
  //Methode pour NOTIFIER
  notifier(titre: string, text: string, item: any) {
    // Schedule a single notification
    this.localNotifications.schedule({
      title: "Un nouvel appartement est disponible",
      text: text,
      icon: 'assets/img/icon.png',
      data: item
    });
    global.skipLocalNotificationReady = true;
  }
  //METHODE TEST Si il ya un NEW PROGRAMME
  testNewProgramme(nouveauTabProduits) {
    let nbreNewProd;
    this.storage.get('produits').then((result) => {
      if (nouveauTabProduits.length >= result.length) {//Si le nouveau TabProduits est plus grand (>19)
        //Dans ce cas, on a un nouveau produit
        nbreNewProd = (nouveauTabProduits.length - result.length);
        console.log("Nombre de New ITEMS: " + nbreNewProd);
        //Boucle pour obtenir maxItemNumber
        let maxItemNumber: number = 0;
        for (let item of result) {
          let itemNumber = +item.id;
          console.log("ID result: " + itemNumber);
          if (itemNumber > maxItemNumber) {
            maxItemNumber = itemNumber;
          }
        }//Fin Boucle MAX item Number
        console.log("BIGGER ID : " + maxItemNumber);
        //On notifie si l'id de l'item de la nouvelle liste est supérieur au plus grand id d'item du tableau stocké
        for (let item of nouveauTabProduits) {
          let itemNumb = +item.id; //Transformer les lettres en chiffres

          if (itemNumb >= maxItemNumber) {
            //Je notifie car l'item a un id supérieur à 19
            let titreNotif: string = "SABLUX: Un nouvel appartement est disponible";
            let contenuNotif: string = "C'est un " + item.typeproduit + " situé à " + item.zone;
            this.notifier(titreNotif, contenuNotif, item);//On notifie
            console.log(" L'ID de l'item : " + itemNumb + " Son contenu" + item);
            //Je set encore la novelle liste de produits pour un prochain test
            this.storage.set('produits', this.tabProduits);// Je STORE le tableau de produits pour les notifications        
          } else {
            console.log("BAD ITEM: L'ID de l'item : " + itemNumb);
          }
        }
      } else {
        //Dans ce cas, Aucun produit n'a été ajouté
        console.log("Aucun Produit Ajouté");
      }
    });
  }//FIN testProgramme

   //Methodes pour tester la connection waserbywork
    //Method that returns true if the user is connected to internet
    private isOnline(): boolean {
        return this.network.type.toLowerCase() !== 'none';
    }
    // Method that returns true if the user is not connected to internet
    private isOffline(): boolean {
      return this.network.type.toLowerCase() === 'none';
    }

  //--------------Loader Methode--------------
    //Le loading pendant que ca charge
    presentLoading() {
      this.loader = this.loadingCtrl.create({
        content: "Chargement..."
      });
      this.loader.present();

      setTimeout(() => {
        this.loader.dismiss();
        let alertDecon = this.alertCtrl.create({
          title: "Vous n'êtes pas connecté à Internet !",
          subTitle: "Veuillez vous connecter pour pouvoir effectuer des recherches",
          buttons: [{
            text: 'Retour',
            handler: () => {
              //TODO quand on clique une notif LOCAL
              this.navCtrl.pop();
            }
          }]
        });
        alertDecon.present();
      }, 12000);
    }
}
