import { Component, OnInit, Output } from '@angular/core';
import { Input } from '@angular/core';
import { ProgsProviderFireApi } from '../../providers/progs/progs';
import { ViewController, AlertController, LoadingController, NavController } from 'ionic-angular';

//Page
import { HomePage } from '../../pages/home/home';

// For Modal
import { ModalController } from 'ionic-angular';

//Native
import { CallNumber } from '@ionic-native/call-number';
import { Network } from '@ionic-native/network';

/**
 * Generated class for the ResultatListPartialComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'resultat-list-partial',
  templateUrl: 'resultat-list-partial.html'
})
export class ResultatListPartialComponent implements OnInit {
  @Input() itemIncomes: any;; //Réception 
  tabProduits: any;//Tableau de programme LOCAL: string;
  arrayResult: any[]=[]; //Tableau des resultats à afficher après filtre selon CRITERES
  urlProduits: string;
  numeroSablux="338694000"; //Numéro SABLUX
  loader: any; //Loader

  //--------------------------------------------------METHODES LIFECYCLE----------------------------------------
  constructor(public navCtrl: NavController, private alertCtrl: AlertController, public loadingCtrl: LoadingController, private network: Network, public alertController: AlertController, public callNumber: CallNumber, private progsServiceFireApi: ProgsProviderFireApi, public modalCtrl : ModalController) {}
  
  ngOnInit(): void {
    
    this.urlProduits='http://seproerp.ddns.net:82/api/index.php/product/list?api_key=rvz6gy28';
    console.log(this.itemIncomes);
    //Si le phone est déconnecté
    if(this.isOnline()) { 
      //ToDO: Si le phone est online
      this.presentLoading();//Affiche le loading
      this.restGetProduits();
    } else {
      let alertDecon = this.alertCtrl.create({
        title: "Déconnecté !!",
        subTitle: "Veuillez vous connecter pour accéder aux services",
        buttons: [{
          text: 'Retour',
          handler: () => {
            //TODO quand on clique une notif LOCAL
            this.navCtrl.setRoot(HomePage);
          }
        }]
      });
      alertDecon.present();
    }
  
  }

  //------------------------------------METHODES LOGIQUE METIERS----------------------------------------------
  //Methodes boutons
  public openContacter() {
    var data = { typeContact : 'contactFromproduit' };
    var modalPage = this.modalCtrl.create('page-contact', data); 
    modalPage.present(); 
  }
  public openAppeler(numero : string) {
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
  
  //For Api REST
  restGetProduits() {
    this.progsServiceFireApi.restGet(this.urlProduits).then(data => {
      this.tabProduits = data;

      //---------------------------------FILTRAAAGE---------------------------------
      if(( this.itemIncomes.zone == "none") && (this.itemIncomes.type == "none") && (this.itemIncomes.prix == 0))
      {
        //Cas ALL none
        this.arrayResult = this.tabProduits;
      
      }else if((( this.itemIncomes.zone != "none") && (this.itemIncomes.type == "none") && (this.itemIncomes.prix == 0) ) || (( this.itemIncomes.zone == "none") && (this.itemIncomes.type != "none") && (this.itemIncomes.prix == 0)) || (( this.itemIncomes.zone == "none") && (this.itemIncomes.type == "none") && (this.itemIncomes.prix != 0)) || (( this.itemIncomes.zone == "none") && (this.itemIncomes.type == "none") && (this.itemIncomes.prix == 0)) ) {
        //Cas ou une seule valeur est donnée (que ce soit zone, type ou prix)
        for (let item of this.tabProduits) {
          if((item.zone == this.itemIncomes.zone) || (item.typeproduit == this.itemIncomes.type) || (item.price <= this.itemIncomes.prix)) {
            this.arrayResult.push(item);
          }else{
            //Cas ou le seul critère ne match pas avec API
            console.log('Cas 1: item don\'t match '+item.zone+'  Type produit  '+item.typeproduit+' PRIX  '+item.price)          }
        }

      }else if((( this.itemIncomes.zone != "none") && (this.itemIncomes.type != "none") && (this.itemIncomes.prix == 0) ) || (( this.itemIncomes.zone != "none") && (this.itemIncomes.type == "none") && (this.itemIncomes.prix != 0)) || (( this.itemIncomes.zone == "none") && (this.itemIncomes.type != "none") && (this.itemIncomes.prix != 0)) ) {
        //Cas ou 2 critères sont données 
        for (let item of this.tabProduits) {
          if(((item.zone == this.itemIncomes.zone) && (item.typeproduit == this.itemIncomes.type)) || ((item.zone == this.itemIncomes.zone) && (item.price <= this.itemIncomes.prix)) || ((item.typeproduit == this.itemIncomes.type) && (item.price <= this.itemIncomes.prix))  ){      
            this.arrayResult.push(item);
          }else{
            //Cas ou les 2 critères ne match pas avec API
            console.log('Cas 2: item don\'t match '+item.zone+'  Type produit  '+item.typeproduit+' PRIX  '+item.price)
          }
        }
      }else {
        //Cas ou tous les critères sont renseignés.
        for (let item of this.tabProduits) {
          if((item.zone == this.itemIncomes.zone) && (item.typeproduit == this.itemIncomes.type) && (item.price <= this.itemIncomes.prix)) {//ZONE

            this.arrayResult.push(item);
            console.log("GOOD ZONE:  "+item.zone+"  TYPE : "+item.typeproduit+" etage "+item.niveauetage+" et qui coute "+item.price);

          }else {
            //Cas ou les 3 critères ne match pas avec API
            console.log('Cas 3: item don\'t match '+item.zone+'  Type produit  '+item.typeproduit+' PRIX  '+item.price)
          } //If ZONE
        }
      }
      //------------------------FINNNN---------FILTRAAAGE---------------------------------

      this.loader.dismiss();// On fait disparaitre le loader
      console.log("Voici le tableau : "+this.arrayResult);
    });//Fin traitement after reception données api REST
  }

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
    }

}



//-----------SNIPPETS------------------
//console.log("Un produit :  "+item.zone+"  ID: "+item.id+" de type "+item.typeproduit+" et qui coute "+item.price);
//this.tabProduits.indexOf(item.zone) <= -1 

  //METHODES LOGIQUE METIER




//----------------SNIPPPETS----------------------
// for (let item of this.tabProduits) {
        //   if((item.zone == this.incomes.zone) && (item.type == this.incomes.type) && (item.etage == this.incomes.etage) && (item.prix <= this.incomes.prix)) {//ZONE

        //     this.arrayResult.push(item);
        //     console.log("GOOD ZONE:  "+item.zone+"  TYPE : "+item.typeproduit+" etage "+item.niveauetage+" et qui coute "+item.price);

        //   }else if((item.zone == this.incomes.zone) && (item.type != this.incomes.type) && (item.etage != this.incomes.etage) && (item.prix >= this.incomes.prix)){
        //     console.log("Item ne respecte pas les critères");
        //   } // If ZONE
        // }
//console.log("Un produit :  "+item.zone+"  ID: "+item.id+" de type "+item.typeproduit+" et qui coute "+item.price);
//this.tabProduits.indexOf(item.zone) <= -1 

  //METHODES LOGIQUE METIER




//----------------SNIPPPETS----------------------
// for (let item of this.tabProduits) {
        //   if((item.zone == this.incomes.zone) && (item.type == this.incomes.type) && (item.etage == this.incomes.etage) && (item.prix <= this.incomes.prix)) {//ZONE

        //     this.arrayResult.push(item);
        //     console.log("GOOD ZONE:  "+item.zone+"  TYPE : "+item.typeproduit+" etage "+item.niveauetage+" et qui coute "+item.price);

        //   }else if((item.zone == this.incomes.zone) && (item.type != this.incomes.type) && (item.etage != this.incomes.etage) && (item.prix >= this.incomes.prix)){
        //     console.log("Item ne respecte pas les critères");
        //   } // If ZONE
        // }


    
        //this.incomes.etage = this.navParams.get('etage');
    //this.incomesAP = JSON.parse(this.incomes);
    //console.log("Voici la zone : "+this.navParams.get('zone'));