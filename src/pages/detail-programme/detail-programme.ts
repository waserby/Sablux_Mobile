import { Component, OnInit, OnChanges } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ProgrammeModel } from '../../models/programme-model';

import { ProgsService } from '../../providers/services/progs.service';

@IonicPage(
  {
    name: 'page-detail-programme'
  }
  )
@Component({
  selector: 'page-detail-programme',
  templateUrl: 'detail-programme.html',
})
export class DetailProgrammePage {
  progs: ProgrammeModel[];//Tableau de programme LOCAL
  chooseprog: ProgrammeModel;


  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,private progservice: ProgsService) {
    
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }

  ngOnInit(){
    this.getProgs();//Je récupère encore la liste des programmes pour chercher dedans celui correspondant au id recu from la page listes des programmes
    this.chooseprog = this.progs[this.navParams.get('itemid')];//Je recupère le programme correspondant à l'id itemid
    console.log(this.chooseprog.id);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailProgrammePage');
  }

  getProgs(): void {//Methode qui recupère les programmes grace à la méthode créee dans le service.
    this.progservice.getProgs().subscribe(progs => this.progs = progs);
  }

  
}
