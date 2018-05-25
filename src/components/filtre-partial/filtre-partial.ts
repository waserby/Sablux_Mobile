import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { ProgsProviderFireApi } from '../../providers/progs/progs';
import { Produit } from '../../models/produit-model';
import { ResultatListPartialComponent } from '../resultat-list-partial/resultat-list-partial';
import { ResultatRecherchePage } from '../../pages/resultat-recherche/resultat-recherche';
import { NavController } from 'ionic-angular';

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
export class FiltrePartialComponent implements OnInit, OnChanges{
  @Input() itemStatut: String; // recoit le statut (Louer/Vendre) From Component Parent qui est Trouver-bien
  tabProduits: any;//Tableau de programme LOCAL: string;
  urlProduits: string;
  arrayZone: string[]=[]; //Tableau des zone disponible dans les programmes de l'API
  //NG MODEL des inputs
    // inputs = {zone: "none", type: "none", prix: 100, etage: "none"};// On initialise pour les default entrie et on recupère en two way databinding
    inputs = {zone: "none", type: "none", prix: 100};// On initialise pour les default entrie et on recupère en two way databinding

  //searchTerm: string = ''; // Terme entrer par le user dans le champ zone
  //Pour filtre template
    text: number = 0;

  //METHODES LIFECYCLE
    constructor( public navCtrl: NavController, private progsServiceFireApi: ProgsProviderFireApi) {
      console.log('Hello FiltrePartialComponent Component');
    }

    ngOnChanges(): void {
      
    }

    ngOnInit(): void {
      this.urlProduits='http://seproerp.ddns.net:82/api/index.php/product/list?api_key=rvz6gy28'
      this.restGetProduits();
      console.log(this.arrayZone);
    }

  //METHODES LOGIQUE METIER
   //For Api REST
    restGetProduits() {
      this.progsServiceFireApi.restGet(this.urlProduits).then(data => {
        this.tabProduits = data;
        for (let item of this.tabProduits) {
          //console.log("Un produit :  "+item.zone+"  ID: "+item.id+" de type "+item.typeproduit+" et qui coute "+item.price);
          if((this.arrayZone.indexOf(item.zone) == -1) && (item.zone!==null) && (item.zone!=="")) { //this.tabProduits.indexOf(item.zone) <= -1 
            this.arrayZone.push(item.zone);
          }
        }
        //console.log("Voici les zones : "+this.arrayZone);
      });
    }
    //Methode de VALIDATION DU FORMULAIRE
    sendInputs(valeur) {
      //console.log(this.inputs);
      //this.navCtrl.setRoot(ResultatRecherchePage, valeur);
      this.navCtrl.push('page-resultat-recherche', valeur);//J'envoi la valeur à travers un navCTRL
    }




    // //For Search terms
    // filterItems(searchTerm){
    //   return this.tabProduits.filter((item) => {
    //       return item.zone.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    //   });    
    // }
    // setFilteredItems() {
    //   this.itemsZone = this.filterItems(this.searchTerm);
    //   console.log('Tableau filtrer :'+this.itemsZone);
    // }

}
