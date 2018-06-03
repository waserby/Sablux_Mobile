import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProgrammesPartialComponent } from '../../components/programmes-partial/programmes-partial';

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
  @ViewChild(ProgrammesPartialComponent) childProgrammes: ProgrammesPartialComponent;
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

  ionViewWillLeave(){
    //En quittant l a page je unsunscribe les subscribes effectué
    // this.eventConnect.unsubscribe();
    console.log('ionViewWillLeave PROGRAMMES byeee');
    this.childProgrammes.eventConnectSubscription.unsubscribe();
    this.childProgrammes.eventDisconnectSubscription.unsubscribe();
    this.childProgrammes.eventGetProgs.unsubscribe();
    this.childProgrammes.eventGetProgsFirebase.unsubscribe();
    console.log("UNSUBSCRIBE PROGRAMMES DONE ");
  }

}
