import { Component } from '@angular/core';
import { NavController, ItemSliding, Item } from 'ionic-angular';
import { ListeProgrammesPage } from '../liste-programmes/liste-programmes';
import { TrouverBienPage } from '../trouver-bien/trouver-bien';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  activeItemSliding: ItemSliding = null;

  constructor(public navCtrl: NavController) {

  }


  //----------Methode pour que le itemsliding fasse le move de slide quand on clique dessus----------
  public openOption(itemSlide: ItemSliding, item: Item, test:String) {
    console.log('opening item slide..');
    
    if(this.activeItemSliding!==null) //use this if only one active sliding item allowed
     this.closeOption();
 
    this.activeItemSliding = itemSlide;
    let swipeAmount;
    if(test=='grand'){
      swipeAmount = 257; //set your required swipe amount
    }else
    {
      swipeAmount = 178;
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
    this.navCtrl.setRoot(ListeProgrammesPage, valeur);
    //{typeDeProgramme: 'rea'}
  }
//Methode pour ouvrir la map recherche bien
  openTrouverBien(valeur: any){ // On recupère le statut (louer/vendre)
    this.navCtrl.setRoot(TrouverBienPage, valeur);
  }
}
