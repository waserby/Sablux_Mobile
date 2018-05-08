import { Component, OnInit, Input } from '@angular/core';

//Types ou Models
import { ProgrammeModel } from '../../models/programme-model';

//Services
import { ProgsService } from '../../providers/services/progs.service';

// //For Modal
// import { ModalController } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';// Pour naviguer




@Component({
  selector: 'programmes-partial',
  templateUrl: 'programmes-partial.html'
})
export class ProgrammesPartialComponent implements OnInit {
  @Input() item: String; // recoit le Type de Programme From Composant Parent qui est liste-Programme
  
  //Declaration des variables de visibilité 
  VisibleRea: string = 'segment-button segment-activated';
  VisibleCours: string = 'one-class';
  VisibleVenir: string = 'one-class';
  
  progs: ProgrammeModel[];//Tableau de programme LOCAL
  etatsegment: String = "realiser";// On met la variable du NgModel à realiser pour que le segment realiser soit actif au départ
  
//FIN INITIALISATION DES VARIABLES

  constructor(private progservice: ProgsService,public navCtrl: NavController, public navParams: NavParams) {}

  ngOnInit() {
    this.getProgs();

    if(this.item=='realiser' || this.item=='cours' || this.item=='venir'){
      this.etatsegment = this.item; // On active la case que le user à cliquer seulement si il a cliquer 1 des 3. Sinon on laisse realiser activer par défaut comme défini avant
    }

  //   switch(this.item) { 
  //     case "rea": { 
  //       this.VisibleRea = 'segment-activated';
  //       this.VisibleCours = '';
  //       this.VisibleVenir = '';
  //        break; 
  //     } 
  //     case "cours": { 
  //       this.VisibleRea = '';
  //       this.VisibleCours = 'segment-activated';
  //       this.VisibleVenir = '';
  //        break; 
  //     } 
  //     case "venir": { 
  //       this.VisibleRea = '';
  //       this.VisibleCours = '';
  //       this.VisibleVenir = 'segment-activated';         
  //       break; 
  //     } 
  //     default: { 
  //        console.log(this.item);
  //        break; 
  //     } 
  //  } 
  }

  getProgs(): void {//MEthode qui recupère les programmes grace à la méthode créee dans le service.
    this.progservice.getProgs().subscribe(progs => this.progs = progs);
  }

  opendetailprogramme(itemid: number) {//Pour afficher le modal (Un modal c'est comme un POPUP pour mobile)
    let modal = this.navCtrl.push('page-detail-programme', itemid);//J'envoi la valeur à travers un modalController
  }
}
