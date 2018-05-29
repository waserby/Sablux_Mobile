import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { ProgsProviderFireApi } from '../../providers/progs/progs';
import { Produit } from '../../models/produit-model';
import { ResultatListPartialComponent } from '../resultat-list-partial/resultat-list-partial';
import { ResultatRecherchePage } from '../../pages/resultat-recherche/resultat-recherche';
import { NavController } from 'ionic-angular';

//Native
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Storage as Store } from '@ionic/storage';

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
export class FiltrePartialComponent implements OnInit{
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
    constructor(public storage: Store, private localNotifications: LocalNotifications, public navCtrl: NavController, private progsServiceFireApi: ProgsProviderFireApi) {
      console.log('Hello FiltrePartialComponent Component');
    }

    ngOnInit(): void {
      this.urlProduits='http://seproerp.ddns.net:82/api/index.php/product/list?api_key=rvz6gy28'
      this.restGetProduits();
      //console.log(this.tabProduits.length());
      
    }

  //METHODES LOGIQUE METIER
   //For Api REST
    restGetProduits() {
      this.progsServiceFireApi.restGet(this.urlProduits).then(data => {
        this.tabProduits = data;
        //On store juste au premier lancement de l'application
        this.storage.get('produits').then(donnee => {
          if ( !donnee ) {
            this.storage.set('produits', this.tabProduits);// Je STORE le tableau de produits pour les notifications        
          }
        })
       .catch(err=>{
          console.log('Your data don\'t exist and returns error in catch: ' + JSON.stringify(err));
        });

        this.testNewProgramme(this.tabProduits);//On test si il y'a un nouveau programme
        
        //Pour les ZONES
        for (let item of this.tabProduits) {
          //console.log("Un produit :  "+item.zone+"  ID: "+item.id+" de type "+item.typeproduit+" et qui coute "+item.price);
          if((this.arrayZone.indexOf(item.zone) == -1) && (item.zone!==null) && (item.zone!=="")) { //this.tabProduits.indexOf(item.zone) <= -1 
            this.arrayZone.push(item.zone);
          }
        }
        //console.log("Voici les zones : "+this.arrayZone.length);
      });
    }
    //Methode de VALIDATION DU FORMULAIRE
    sendInputs(valeur) {
      //console.log(this.inputs);
      //this.navCtrl.setRoot(ResultatRecherchePage, valeur);
      this.navCtrl.push('page-resultat-recherche', valeur);//J'envoi la valeur à travers un navCTRL
    }

    notifier(titre: string, text: string){
     // Schedule a single notification
     this.localNotifications.schedule({
      title: titre,
      text: text,
      // title: 'SABLUX: Un nouvel appartement est disponible',
      // text: 'Un nouvel appartement a louer à MERMOZ',
      icon: 'assets/img/icon.png',
      //data: { secret: this.arrayZone }
    }); 
    }

    testNewProgramme(nouveauTabProduits) {
      let nbreNewProd;
      this.storage.get('produits').then((result) => {
        if(nouveauTabProduits.length >= result.length){//Si le nouveau TabProduits est plus grand (>19)
          //Dans ce cas, on a un nouveau produit
          nbreNewProd = (nouveauTabProduits.length - result.length);
          console.log("Nombre de New ITEMS: "+nbreNewProd);
          for (let item of nouveauTabProduits) {
            let itemNumber = +item.id; //Transformer les lettres en chiffres
            if(itemNumber >= 20){
              //Je notifie car l'item a un id supérieur à 19
              let titreNotif : string = "SABLUX: Un nouvel appartement est disponible";
              let contenuNotif : string  = "C'est un "+item.typeproduit+"situé à "+item.zone;
              this.notifier( titreNotif, contenuNotif);//On notifie
              console.log(" L'ID de l'item : "+itemNumber+" Son contenu"+item);
              //Je set encore la novelle liste de produits pour un prochain test
              this.storage.set('produits', this.tabProduits);// Je STORE le tableau de produits pour les notifications        
            }else {
              console.log("BAD ITEM: L'ID de l'item : "+itemNumber);
            }
          }
          console.log("Nouveau Produit"+nouveauTabProduits);
        }else{
          console.log("Aucun Produit Ajouté");
        }
      });
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
