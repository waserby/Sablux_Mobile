import { Component, OnInit, Input, OnChanges } from '@angular/core';

//Types ou Models
import { ProgrammeModel } from '../../models/programme-model';

//Services
import { ProgsService } from '../../providers/services/progs.service';
import { ProgsProviderFireApi } from '../../providers/progs/progs';//Service avec Firebase et APIREST
import { Network } from '@ionic-native/network';

// //For Modal
// import { ModalController } from 'ionic-angular';
import { NavController, NavParams, LoadingController, AlertController, Platform, Alert, ToastController, ViewController } from 'ionic-angular';// Pour naviguer et loading
import { Observable, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Storage as Store } from '@ionic/storage';
import { HomePage } from '../../pages/home/home';

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
    //For API REST  
      progsFireBase : any //C'est le tableau CACHE, qui est affiché dans le template
      loader: any; //For Loader of Firebase
    //EVENTS SUBCRIBE
      eventConnectSubscription : Subscription;
      eventDisconnectSubscription : Subscription;
      eventGetProgs : Subscription;
      eventGetProgsFirebase : Subscription;

  //-------FIN INITIALISATION DES VARIABLES---------------------

  //----------------METHODES LifeCycle-------------------
      constructor(public storage: Store, public viewCtrl: ViewController, private toastCtrl: ToastController, private platform: Platform, public alertCtrl: AlertController, private network: Network, private progsServiceFireApi: ProgsProviderFireApi ,private progservice: ProgsService,public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController) {}
        ngOnInit() {
          this.platform.ready().then(() => {
            this.presentLoading();
            //this.getListProgsFirebase();
            
            if(this.isOnline()) { 
              //ToDO: Si le user est online
              this.getListProgsFirebase();

            } else {
              //ToDO: Si le user est OFFLINE
              this.storage.get('listProgrammes').then(result => {
                if (!result) {
                  //Si les programmes n'avaient pas été récupéré from fireBASE et set alors
                  this.getListProgsFirebase(); // Je les récupère et les store
                }else {
                  //Si une liste à déja été stocké, on l'utilise
                  this.storage.get('listProgrammes').then(data => { this.progsFireBase = data});// Le tableau de produits précédemment stocker est recuperer
                  this.isAvailable = true;
                  this.loader.dismiss();
                }
              })
              .catch(err => {
                console.log('Your data don\'t exist and returns error in catch: ' + JSON.stringify(err));
              });
              
            }
            //CHANGE STATE TO CONNECT
              this.eventConnectSubscription = this.network.onConnect().subscribe(() => {
                console.log('network connected!');
                console.log("Avalaible:  "+this.isAvailable);
                if(!this.isAvailable){ //checking if it is false then dismiss() the no internet alert
                  console.log("If:  "+this.noInternetAlert);
                  this.noInternetAlert.dismiss();
                }
                this.isAvailable = true;
                this.connectedToInternet = this.toastCtrl.create({
                  message: 'De nouveau connecté. Mise à jour des programmes',
                  duration: 2000,
                  position: 'bottom'
                });
                
                this.presentLoading();//Affiche le loading
                this.getListProgsFirebase();
                this.connectedToInternet.present();
              });

            //CHANGE STATE TO DISCONNECT
              this.eventDisconnectSubscription = this.network.onDisconnect().subscribe(() => {
                if(this.isAvailable){// if it is true then dismiss the connected to internet alert darlaime@yahoo.fr
                  this.connectedToInternet.dismiss();
                }
                this.isAvailable = false;
                this.noInternetAlert = this.toastCtrl.create({
                  message: 'Deconnecté',
                  duration: 2000,
                  position: 'bottom'
                 });
                 this.storage.get('listProgrammes').then(data => { this.progsFireBase = data});// Le tableau de produits précédemment stocker est recuperer
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
      // getProgs(): void {//MEthode qui recupère les programmes grace à la méthode créee dans le service.
      //   this.eventGetProgs = this.progservice.getProgs().subscribe(progs => {
      //     this.progsFireBase = progs;
      //     this.loader.dismiss();// On fait disparaitre le loader
      //   });
      //   //this.progsFireBase = this.progservice.getProgs();
      // }

      opendetailprogramme(itemall: any) {//Pour afficher la page detail programme
        let window = this.navCtrl.push('page-detail-programme', itemall);//J'envoi la valeur à travers un navCTRL
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
      this.eventGetProgsFirebase = this.progsServiceFireApi.getProgsList().snapshotChanges().map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      }).subscribe(result => {
        //ToDO: Quand la liste a été récupérée
        this.progsFireBase = result;
        this.storage.set('listProgrammes', this.progsFireBase);// Je les store
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

        setTimeout(() => {
          //après 10 secondes, on charge les programmes locaux
          //ToDO: Si le user est OFFLINE
          this.storage.get('listProgrammes').then(result => {
            if (!result) {
              //Si on n'avais jamais recuperer les programmes, on alert et on fait retour
              let alertDecon = this.alertCtrl.create({
                title: "Vous n'êtes pas connecté à Internet !",
                subTitle: "Veuillez vous connecter pour charger les programmes",
                buttons: [{
                text: 'Retour',
                  handler: () => {
                  //TODO quand on clique une notif LOCAL
                    this.navCtrl.setRoot(HomePage);
                  }
                }]
              });
              alertDecon.present();
            }else{
              //Si les programmes n'avaient pas été récupéré from fireBASE et set alors
              this.storage.get('listProgrammes').then(data => { this.progsFireBase = data});// Le tableau de produits précédemment stocker est recuperer            }else {
            }
          })
          .catch(err => {
            console.log('Your data don\'t exist and returns error in catch: ' + JSON.stringify(err));
          });   
          this.loader.dismiss();       
        }, 10000); 
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

      //Dismiss
      dismiss() {
        this.viewCtrl.dismiss();
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
