import { Component, OnInit, Input, OnChanges } from '@angular/core';

//Types ou Models
import { ProgrammeModel } from '../../models/programme-model';

//Services
import { ProgsService } from '../../providers/services/progs.service';
import { ProgsProviderFireApi } from '../../providers/progs/progs';//Service avec Firebase et APIREST
import { Network } from '@ionic-native/network';

// //For Modal
// import { ModalController } from 'ionic-angular';
import { NavController, NavParams, LoadingController, AlertController, Platform } from 'ionic-angular';// Pour naviguer et loading
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'programmes-partial',
  templateUrl: 'programmes-partial.html'
})
export class ProgrammesPartialComponent implements OnInit {
  http: HttpClient;
  //---------------START INITIALISATION------------------------
  @Input() item: String; // recoit le Type de Programme From Composant Parent qui est liste-Programme
  progs: ProgrammeModel[];//Tableau de programme LOCAL
  etatsegment: String = "realiser";// On met la variable du NgModel à realiser pour que le segment realiser soit actif au départ
  //For API REST  
  // progAPI: any;
  //From Firebase
  progsFireBase : Observable<ProgrammeModel[]>
  //For Loader of Firebase
  loader: any;
  //-------FIN INITIALISATION DES VARIABLES---------------------

  constructor(private platform: Platform, public alertCtrl: AlertController, private network: Network, private progsServiceFireApi: ProgsProviderFireApi ,private progservice: ProgsService,public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController) {}

  //----------------METHODES LifeCycle-------------------
      ngOnInit() {
        this.presentLoading();//Affiche le loading
        this.getListProgsFirebase();
        // Je check si le mobile est passe vers connecté
         let connectSubscription = this.network.onConnect().subscribe(() => {
           console.log('network connected!');
           
           this.showAlertConnexion();
           this.presentLoading();//Affiche le loading
           this.getListProgsFirebase();
         });
         // Je check si il ya deconnexion
         let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
           console.log('network was disconnected :-(');
           this.showAlertDeconnexion();
           this.getProgs();
         });
        //this.ajoutAllProgsToFirebase(); // FIREBASE Insertion de Tous les programmes du mock
        //this.restGetProgs();
        if(this.item=='realiser' || this.item=='cours' || this.item=='venir'){
          this.etatsegment = this.item; // On active la case que le user à cliquer seulement si il a cliquer 1 des 3. Sinon on laisse realiser activer par défaut comme défini avant
        } 
      }

      // ionViewWillEnter() {
      //   this.platform.ready().then(() => {
      //     if(this.isOnline()) {
      //       //ToDO: Si le user est online
      //       this.getListProgsFirebase();
      //     } else {
      //       //ToDO: Si le user est OFFLINE
      //       this.getProgs();
      //     }
      //   });
      // }
  //-----------FIN---METHODES LifeCycle-------------------

  
  //----------------METHODES Communication interne-------------------
      getProgs(): void {//MEthode qui recupère les programmes grace à la méthode créee dans le service.
        // this.progservice.getProgs().subscribe(progs => this.progsFireBase = progs);
        this.progsFireBase = this.progservice.getProgs();
        this.loader.dismiss();// On fait disparaitre le loader
      }

      opendetailprogramme(itemid: number) {//Pour afficher la page detail programme
        let window = this.navCtrl.push('page-detail-programme', itemid);//J'envoi la valeur à travers un navCTRL
      }
  
  //---------------FIN METHODES COMMUNICATIONS INTERNES APP----------------
  
  //---------------------METHODES COMMUNICATION EXTERNES (API et FIREBBASE)---------------------
    //Methode ajout All programmes sur FIREBASE
    ajoutAllProgsToFirebase(){
      for (let item of this.progs) { 
        this.progsServiceFireApi.addProg(item).then(ref => {
        console.log('Le programme '+item.nom+' a été ajouté à FIREBASE et sa reference est: '+ref);
        })
      }
    }
    //Méthode qui recupère la liste des programmes from firebase
    getListProgsFirebase(){
      this.progsFireBase = this.progsServiceFireApi.getProgsList()
        .snapshotChanges()
        .map(
        changes => {
          return changes.map(c => ({
            key: c.payload.key, ...c.payload.val()
          }))
        });
        this.loader.dismiss();// On fait disparaitre le loader
    }
    

    // //FOR API REST
    // restGetProgs() {
    //   this.progsServiceFireApi.restGetProgs().then(data => {
    //     this.progAPI = data;
    //     for (let item of this.progAPI) {
    //       console.log("Un programmes :  "+item.label+"  ID: "+item.id);
    //   }
    //   });
    // }

  //--------------------FIN-METHODES COMMUNICATION EXTERNES (API et FIREBBASE)---------------------

  //--------------Loader Methode--------------
      //Le loading pendant que ca charge
      presentLoading() {
        this.loader = this.loadingCtrl.create({
          content: "Chargement..."
        });
        this.loader.present();
      }
      //Méthode pour l'alerte connexion deconnexion
      showAlertDeconnexion() {
        this.loader.dismiss();// On fait disparaitre le loader
        let alert = this.alertCtrl.create({
          title: 'Deconnecté :/',
          subTitle: 'Vous venez n êtes pas connecter à Internet. Les programmes sauvegardés en local seront affichés.',
          buttons: ['OK']
        });
        alert.present();
      }
      //Méthode pour l'alerte connexion deconnexion
      showAlertConnexion() {
        let alert = this.alertCtrl.create({
          title: 'Connecté :) !!!',
          subTitle: 'Vous êtes connecté à Internet. La liste des programmes a été mise à jour.',
          buttons: ['OK']
        });
        alert.present();
      }

}

























//SNIPPETS
//   switch(this.item) { 
  //     case "rea": { 
  //       this.VisibleRea = 'segment-activated';
  //       this.VisibleCours = '';
  //       this.VisibleVenir = '';
  //        break; 
  //     } 
  //     case "cours": { 
  //       this.VisibleRea = '';
  //       this.VisibleCours = 'segment-activated';
  //       this.VisibleVenir = '';
  //        break; 
  //     } 
  //     case "venir": { 
  //       this.VisibleRea = '';
  //       this.VisibleCours = '';
  //       this.VisibleVenir = 'segment-activated';         
  //       break; 
  //     } 
  //     default: { 
  //        console.log(this.item);
  //        break; 
  //     } 
  //  } 