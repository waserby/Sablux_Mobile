import { Component, OnInit, OnChanges } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ProgrammeModel } from '../../models/programme-model';

import { ProgsService } from '../../providers/services/progs.service';
import { ProgsProviderFireApi } from '../../providers/progs/progs';
import { Observable } from 'rxjs';

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
  chooseprog: ProgrammeModel;

  constructor(private progsServiceFireApi: ProgsProviderFireApi , public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,private progservice: ProgsService) {
    // console.log(this.chooseprog.tabUrlImg[0]);
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }

  ngOnInit(){
    this.chooseprog =  this.navParams.get('itemall')
    console.log(this.chooseprog.nom);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailProgrammePage');
  }

}


//---------------------------SNIPPETS----------------------------

//this.getProgs();//Je récupère encore la liste des programmes pour chercher dedans celui correspondant au id recu from la page listes des programmes
//this.chooseprog = this.progs[this.navParams.get('itemall')];//Je recupère le programme correspondant à l'id itemid
     
// getProgs(): void {//Methode qui recupère les programmes grace à la méthode créee dans le service.
//   this.progservice.getProgs().subscribe(progs => this.progs = progs);
// }


//progs: ProgrammeModel[];//Tableau de programme LOCAL
  