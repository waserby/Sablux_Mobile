import { Component, OnInit } from '@angular/core';

//Types ou Models
import { ProgrammeModel } from '../../models/programme-model';

//Services
import { ProgsService } from '../../providers/services/progs.service';

//For Modal
import { ModalController } from 'ionic-angular';

@Component({
  selector: 'programmes-partial',
  templateUrl: 'programmes-partial.html'
})
export class ProgrammesPartialComponent implements OnInit {
  progs: ProgrammeModel[];//Tableau de programme LOCAL
  etatsegment: String = "realiser";// On met la variable du NgModel à realiser pour que le segment realiser soit actif au départ
  
  constructor(private progservice: ProgsService,public modalCtrl: ModalController) {}

  ngOnInit(){
    this.getProgs();
  }

  getProgs(): void {//MEthode qui recupère les programmes grace à la méthode créee dans le service.
    this.progservice.getProgs().subscribe(progs => this.progs = progs);
  }

  presentModal(itemid: number) {//Pour afficher le modal (Un modal c'est comme un POPUP pour mobile)
    let modal = this.modalCtrl.create('page-detail-programme', itemid);//J'envoi la valeur à travers un modalController
    modal.present();
  }
}
