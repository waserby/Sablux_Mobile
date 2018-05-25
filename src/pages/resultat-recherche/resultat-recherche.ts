import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ProgsProviderFireApi } from '../../providers/progs/progs';//Api provider
import { Produit } from '../../models/produit-model';

/**
 * Generated class for the ResultatRecherchePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage(
  {
    name: 'page-resultat-recherche'
  }
  )
@Component({
  selector: 'page-resultat-recherche',
  templateUrl: 'resultat-recherche.html',
})
export class ResultatRecherchePage implements OnInit {
  incomes = {}; //On garde les critères du USER

  //METHODES LIFECYCLE
  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, private progsServiceFireApi: ProgsProviderFireApi) {
  }
  ngOnInit(): void {
    //On récupère les données send from page recherche avec FILTRE
    this.incomes = this.navParams.get('datafiltre');
    console.log(this.incomes);    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResultatRecherchePage');
  }

  //Dismiss
  dismiss() {
    this.viewCtrl.dismiss();
  }
}
