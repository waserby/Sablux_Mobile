import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProgsProviderFireApi } from '../../providers/progs/progs';//Api provider
import { Produit } from '../../models/produit-model';

/**
 * Generated class for the ResultatRecherchePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-resultat-recherche',
  templateUrl: 'resultat-recherche.html',
})
export class ResultatRecherchePage implements OnInit {
  urlProduits: string;
  incomes = {zone: "", type: "", prix: 0}; //On garde les critères du USER
  tabProduits: any;//Tableau de programme LOCAL: string;
  arrayResult: any[]=[]; //Tableau des resultats à afficher après filtre selon CRITERES


  //METHODES LIFECYCLE
  constructor(public navCtrl: NavController, public navParams: NavParams, private progsServiceFireApi: ProgsProviderFireApi) {
  }
  ngOnInit(): void {
    this.urlProduits='http://seproerp.ddns.net:82/api/index.php/product/list?api_key=rvz6gy28'
    //On récupère les données send from page recherche avec FILTRE
    this.incomes.zone = this.navParams.get('zone');
    this.incomes.type = this.navParams.get('type');
    this.incomes.prix = this.navParams.get('prix');
    //this.incomes.etage = this.navParams.get('etage');
    //this.incomesAP = JSON.parse(this.incomes);
    this.restGetProduits();
    //console.log("Voici la zone : "+this.navParams.get('zone'));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResultatRecherchePage');
  }

//console.log("Un produit :  "+item.zone+"  ID: "+item.id+" de type "+item.typeproduit+" et qui coute "+item.price);
//this.tabProduits.indexOf(item.zone) <= -1 

  //METHODES LOGIQUE METIER
  //For Api REST
  restGetProduits() {
    this.progsServiceFireApi.restGet(this.urlProduits).then(data => {
      this.tabProduits = data;

      //---------------------------------FILTRAAAGE---------------------------------
      if(( this.incomes.zone == "none") && (this.incomes.type == "none") && (this.incomes.prix == 100))
      {
        //Cas ALL none
        this.arrayResult = this.tabProduits;
      
      }else if((( this.incomes.zone != "none") && (this.incomes.type == "none") && (this.incomes.prix == 100) ) || (( this.incomes.zone == "none") && (this.incomes.type != "none") && (this.incomes.prix == 100)) || (( this.incomes.zone == "none") && (this.incomes.type == "none") && (this.incomes.prix != 100)) || (( this.incomes.zone == "none") && (this.incomes.type == "none") && (this.incomes.prix == 100)) ) {
        //Cas ou une seule valeur est donnée (que ce soit zone, type ou prix)
        for (let item of this.tabProduits) {
          if((item.zone == this.incomes.zone) || (item.typeproduit == this.incomes.type) || (item.price <= this.incomes.prix)) {
            this.arrayResult.push(item);
          }else{
            //Cas ou le seul critère ne match pas avec API
            console.log('Cas 1: item don\'t match '+item.zone+'  Type produit  '+item.typeproduit+' PRIX  '+item.price)          }
        }

      }else if((( this.incomes.zone != "none") && (this.incomes.type != "none") && (this.incomes.prix == 100) ) || (( this.incomes.zone != "none") && (this.incomes.type == "none") && (this.incomes.prix != 100)) || (( this.incomes.zone == "none") && (this.incomes.type != "none") && (this.incomes.prix != 100)) ) {
        //Cas ou 2 critères sont données 
        for (let item of this.tabProduits) {
          if(((item.zone == this.incomes.zone) && (item.typeproduit == this.incomes.type)) || ((item.zone == this.incomes.zone) && (item.price <= this.incomes.prix)) || ((item.typeproduit == this.incomes.type) && (item.price <= this.incomes.prix))  ){      
            this.arrayResult.push(item);
          }else{
            //Cas ou les 2 critères ne match pas avec API
            console.log('Cas 2: item don\'t match '+item.zone+'  Type produit  '+item.typeproduit+' PRIX  '+item.price)
          }
        }
      }else {
        //Cas ou tous les critères sont renseignés.
        for (let item of this.tabProduits) {
          if((item.zone == this.incomes.zone) && (item.typeproduit == this.incomes.type) && (item.price <= this.incomes.prix)) {//ZONE

            this.arrayResult.push(item);
            console.log("GOOD ZONE:  "+item.zone+"  TYPE : "+item.typeproduit+" etage "+item.niveauetage+" et qui coute "+item.price);

          }else {
            //Cas ou les 3 critères ne match pas avec API
            console.log('Cas 3: item don\'t match '+item.zone+'  Type produit  '+item.typeproduit+' PRIX  '+item.price)
          } //If ZONE
        }
      }
      //------------------------FINNNN---------FILTRAAAGE---------------------------------

      console.log("Voici le tableau : "+this.arrayResult);
    });//Fin traitement after reception données api REST
  }

}





//----------------SNIPPPETS----------------------
// for (let item of this.tabProduits) {
        //   if((item.zone == this.incomes.zone) && (item.type == this.incomes.type) && (item.etage == this.incomes.etage) && (item.prix <= this.incomes.prix)) {//ZONE

        //     this.arrayResult.push(item);
        //     console.log("GOOD ZONE:  "+item.zone+"  TYPE : "+item.typeproduit+" etage "+item.niveauetage+" et qui coute "+item.price);

        //   }else if((item.zone == this.incomes.zone) && (item.type != this.incomes.type) && (item.etage != this.incomes.etage) && (item.prix >= this.incomes.prix)){
        //     console.log("Item ne respecte pas les critères");
        //   } // If ZONE
        // }