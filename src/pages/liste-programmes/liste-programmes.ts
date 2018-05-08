import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ListeProgrammesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-liste-programmes',
  templateUrl: 'liste-programmes.html',
})
export class ListeProgrammesPage implements OnInit {
  TypeProgrammeAccueil: String;
  typeProg : String;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ngOnInit(){
    this.typeProg = this.navParams.get('typeDeProgramme'); //On recupère le type de programme choisi et on stocke
    
  }
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListeProgrammesPage');
  }

}
