import { Component, OnInit, Input, OnChanges } from '@angular/core';

//Types ou Models
import { ProgrammeModel } from '../../models/programme-model';

//Services
import { ProgsService } from '../../providers/services/progs.service';
import { ProgsProviderFireApi } from '../../providers/progs/progs';//Service avec Firebase et APIREST
import { Network } from '@ionic-native/network';

// //For Modal
// import { ModalController } from 'ionic-angular';
import { NavController, NavParams, LoadingController, AlertController, Platform, Alert, ToastController } from 'ionic-angular';// Pour naviguer et loading
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'programmes-partial',
  templateUrl: 'programmes-partial.html'
})
export class ProgrammesPartialComponent implements OnInit {
  
  //---------------START INITIALISATION------------------------
    @Input() item: String; // recoit le Type de Programme From Composant Parent qui est liste-Programme
    progs: ProgrammeModel[];//Tableau de programme LOCAL
    etatsegment: String = "realiser";// On met la variable du NgModel à realiser pour que le segment realiser soit actif au départ
    //For ALert internet
      isAvailable: Boolean; //boolean variable helps to find which alert we should dissmiss   
      connectedToInternet; //made global to get access 
      noInternetAlert; // made global to get access 
      public alertPresentedCon: any;
      public alertPresentedDecon: any;
    //For API REST  
      progsFireBase : any //From Firebase
      loader: any; //For Loader of Firebase

  //-------FIN INITIALISATION DES VARIABLES---------------------

  //----------------METHODES LifeCycle-------------------
      constructor(private toastCtrl: ToastController, private platform: Platform, public alertCtrl: AlertController, private network: Network, private progsServiceFireApi: ProgsProviderFireApi ,private progservice: ProgsService,public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController) {}
        ngOnInit() {
          this.platform.ready().then(() => {
            this.presentLoading();
            this.getProgs();
            
            if(this.isOnline()) { 
              //ToDO: Si le user est online
              this.getListProgsFirebase();
            } else {
              //ToDO: Si le user est OFFLINE
              this.getProgs();
              this.isAvailable = true;
            }

            //CHANGE STATE TO CONNECT
              let connectSubscription = this.network.onConnect().subscribe(() => {
                console.log('network connected!');
                console.log("Avalaible:  "+this.isAvailable);
                if(!this.isAvailable){ //checking if it is false then dismiss() the no internet alert
                  console.log("If:  "+this.noInternetAlert);
                  this.noInternetAlert.dismiss();
                }
                this.isAvailable = true;
                this.connectedToInternet = this.toastCtrl.create({
                  message: 'De nouveau connecté',
                  duration: 2000,
                  position: 'bottom'
                });
                
                this.presentLoading();//Affiche le loading
                this.getListProgsFirebase();
                this.connectedToInternet.present();
              });

            //CHANGE STATE TO DISCONNECT
              let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
                if(this.isAvailable){// if it is true then dismiss the connected to internet alert
                  this.connectedToInternet.dismiss();
                }
                this.isAvailable = false;
                this.noInternetAlert = this.toastCtrl.create({
                  message: 'Deconnecté',
                  duration: 2000,
                  position: 'bottom'
                });
                
                this.presentLoading();//Affiche le loading
                this.getProgs();
                this.noInternetAlert.present();
              });

            //this.ajoutAllProgsFirebase(); // FIREBASE Insertion de Tous les programmes du mock
            //this.restGetProgs();
            if(this.item=='realiser' || this.item=='cours' || this.item=='venir'){
              this.etatsegment = this.item; // On active la case que le user à cliquer seulement si il a cliquer 1 des 3. Sinon on laisse realiser activer par défaut comme défini avant
            }
          });//FIN platform ready
        }//Fin on init()

  //-----------FIN---METHODES LifeCycle-------------------

  
  //----------------METHODES Communication interne-------------------
      getProgs(): void {//MEthode qui recupère les programmes grace à la méthode créee dans le service.
        this.progservice.getProgs().subscribe(progs => {
          this.progsFireBase = progs;
          this.loader.dismiss();// On fait disparaitre le loader
        });
        //this.progsFireBase = this.progservice.getProgs();
      }

      opendetailprogramme(itemid: number) {//Pour afficher la page detail programme
        let window = this.navCtrl.push('page-detail-programme', itemid);//J'envoi la valeur à travers un navCTRL
      }
  
  //---------------FIN METHODES COMMUNICATIONS INTERNES APP----------------
  
  //---------------------METHODES COMMUNICATION EXTERNES (API et FIREBBASE)---------------------
    //Methode ajout All programmes sur FIREBASE
    ajoutAllProgsFirebase(){
      for (let item of this.progsFireBase) { 
        this.progsServiceFireApi.addProg(item).then(ref => {
        console.log('Le programme '+item.nom+' a été ajouté à FIREBASE et sa reference est: '+ref);
        })
      }
    }
    //Méthode qui recupère la liste des programmes from firebase
    getListProgsFirebase(){
      // Use snapshotChanges().map() to store the key
      this.progsServiceFireApi.getProgsList().snapshotChanges().map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      }).subscribe(result => {
        //ToDO: Quand la liste a été récupérée
        this.progsFireBase = result;
        this.loader.dismiss();// On fait disparaitre le loader
      }); 
    }
    
  //--------------------FIN-METHODES COMMUNICATION EXTERNES (API et FIREBBASE)---------------------

    //--------------Loader Methode--------------
      //Le loading pendant que ca charge
      presentLoading() {
        this.loader = this.loadingCtrl.create({
          content: "Chargement..."
        });
        this.loader.present();
      }

      //Methodes pour tester la connection waserbywork
        // Method that returns true if the user is connected to internet
        private isOnline(): boolean {
          return this.network.type.toLowerCase() !== 'none';
        }
        // Method that returns true if the user is not connected to internet
        private isOffline(): boolean {
          return this.network.type.toLowerCase() === 'none';
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




  // this.progsServiceFireApi.getProgsList()
      //   .snapshotChanges()
      //   .map(
      //   changes => {
      //     return changes.map(c => ({
      //       key: c.payload.key, ...c.payload.val()
      //     }))
      //   }).subscribe(result => {
      //     //TODO: Après recup de la liste from Firebase
      //     this.progsFireBase = result;
      //     this.loader.dismiss();// On fait disparaitre le loader
      //   });;





      // //Méthode pour l'alerte connexion 
      // showAlertConnexion() {
      //   let alert = this.alertCtrl.create({
      //     title: 'Connecté :) !!!',
      //     subTitle: 'Vous êtes de nouveau connecté à Internet. La liste des programmes va être mise à jour.',
      //     buttons: ['OK']
      //   });
      //   alert.present();
      // }




       //Méthode pour l'alerte deconnexion
      // showAlert() {
      //   this.loader.dismiss();// On fait disparaitre le loader
      //   let alert = this.alertCtrl.create({
      //     title: 'Deconnecté :/',
      //     subTitle: 'Vous venez d\'être deconnecté d\'Internet. Les programmes sauvegardés en local seront affichés.',
      //     buttons: ['OK']
      //   });
      //   alert.present();
      // }





      //Methode Alerte GENERIQUE
      // showAlert(title, subTitle) {
      //   let vm = this
      //   if(!vm.alertPresented) {
      //     vm.alertPresented = true
      //     vm.alertCtrl.create({
      //       title: title,
      //       subTitle: subTitle,
      //       buttons: [{
      //         text: 'OK',
      //         handler: () => {
      //           vm.alertPresented = false
      //         }
      //       }],
      //     }).present();
      //   }
      // }





      // //FOR API REST
    // restGetProgs() {
    //   this.progsServiceFireApi.restGet('http://seproerp.ddns.net:84/api/index.php/category/list/product?api_key=f5a06c52b2e8b6a31898da190f74d295').then(data => {
    //     this.progAPI = data;
    //     for (let item of this.progAPI) {
    //       console.log("Un programmes :  "+item.label+"  ID: "+item.id);
    //   }
    //   });
    // }




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




      // // Je check si le mobile passe vers connecté
      // let connectSubscription = this.network.onConnect().subscribe(() => {
      //   console.log('network connected!');
      //   if(!this.isAvailable){ //checking if it is false then dismiss() the no internet alert
      //     this.disconnectedToInternet.dismiss();
      //   }
      //   this.isAvailable =true;
      //   this.connectedToInternet = this.showAlert('Connecté :) !!!','Vous êtes de nouveau connecté à Internet. La liste des programmes va être mise à jour.');
      //   this.presentLoading();//Affiche le loading
      //   this.getListProgsFirebase();
      // });





      // ionViewWillEnter() {
      //   this.platform.ready().then(() => {
      //     if(this.isOnline()) {
      //       //ToDO: Si le user est online
      //       this.getListProgsFirebase();
      //     } else {
      //       //TODO: Si le user est OFFLINE
      //       this.getProgs();
      //     }
      //   });
      // }




      // // Je check si il ya deconnexion
          // let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
          //   console.log('network was disconnected :-(');
          //   if(this.isAvailable){// if it is true then dismiss the connected to internet alert
          //     this.connectedToInternet.dismiss();
          //   }
          //   this.isAvailable = false;
          //   this.disconnectedToInternet = this.showAlert('Deconnecté :/','Vous venez d\'être deconnecté d\'Internet. Les programmes sauvegardés en local seront affichés.');
          //   this.presentLoading();//Affiche le loading
          //   this.getProgs();
          // });



          //  //Methode Alerte
      // showAlert(title, subTitle) : Alert{
      //   let vm = this;
      //   if(!vm.alertPresented) {
      //     vm.alertPresented = true
      //     let alert = vm.alertCtrl.create({
      //       title: title,
      //       subTitle: subTitle,
      //       buttons: [{
      //         text: 'OK',
      //         handler: () => {
      //           vm.alertPresented = false
      //         }
      //       }],
      //     }).present();
      //   }

      //showAlert(){
      //   this.loader.dismiss();// On fait disparaitre le loader
      //   let alert = this.alertCtrl.create({
      //     title: title,
      //     subTitle: subTitle,
      //     buttons: ['OK']
      //   });
      //   alert.present();
      //   return alert;
      // }

      //L'alerte
              // this.connectedToInternet = this.alertCtrl.create({
              //   title:'Connecté :)',
              //   subTitle: 'Vous êtes de nouveau connecté à Internet. La liste des programmes va être mise à jour.',
              //   buttons: ['OK']
              // });

      //L'alerte
        // this.noInternetAlert = this.alertCtrl.create({
        //   title:'Deconnecté :/',
        //   subTitle: 'Vous venez d\'être deconnecté d\'Internet. Les programmes sauvegardés en local seront affichés.',
        //   buttons: ['OK']
        // });
