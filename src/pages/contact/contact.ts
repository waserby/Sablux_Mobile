import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform, AlertController, ToastController } from 'ionic-angular';
import { OnInit } from '@angular/core';
import { EmailComposer } from '@ionic-native/email-composer';

/**
 * Generated class for the ContactPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage(
  {
  name: 'page-contact'
})
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})

export class ContactPage implements OnInit{
  @ViewChild('myInput') myInput: ElementRef; //on recupère l'&l&ment text area

  typeContact : String;
  entre = {prenom: "", nom: "", telephone: null, mail:"", modeContact:"telephone" , message:""};// On initialise pour les default entrie et on recupère en two way databinding
  

  //METHODES LIFECYCLE
  constructor(private toastCtrl: ToastController, public alertController: AlertController, public platform: Platform, private emailComposer: EmailComposer, public viewCtrl : ViewController, public navCtrl: NavController, public navParams: NavParams) {
  }

  ngOnInit(): void {
    this.typeContact = this.navParams.get('typeContact');
    if(this.typeContact=="contactFromproduit"){
      this.entre.message  =`Je souhaiterais avoir plus de renseignement sur ce bien et prendre rendez-vous pour le visiter.\nPourriez-vous me recontacter?`;
    }else if (this.typeContact=="contactFromProgramme"){
      this.entre.message  =`je suis interessé par ce programme et je souhaiterais avoir plus de renseignements.\nPourriez-vous me recontacter?`;
    }else{
      this.entre.message  =`Pourriez-vous me recontacter?`;
    }
    // console.log("le message : "+this.typeContact);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactPage');
  }

  //METHODES LOGIQUE METIER
  public closeModal(){
    this.viewCtrl.dismiss();
  }

  sendEntries(valeur) {//Fonction de validation du formulaire
    if((valeur.nom!="") && (valeur.prenom!="") && (valeur.mail!="") && (valeur.telephone!="" ) && (valeur.telephone!=null)){
      //Fonction de mailing
      let constructionSujet = "SABLUX MOBILE: Le client "+valeur.prenom+" "+valeur.nom+" souhaiterait être recontacter par "+valeur.modeContact;
      let constructionMessage = "Bonjour, <br/><br/>"+"M./Mme "+valeur.prenom+" "+valeur.nom+" souhaiterait être recontacter par "+valeur.modeContact+".<br/>Son numéro de telephone est "+valeur.telephone+" et son adresse email est "+valeur.mail+".<br/>Le client a aussi laissé un message qui est le suivant : <br/><br/>"+valeur.message+"<br/><br/>Bonne reception,";
      this.sendEmail(constructionSujet,constructionMessage);
    }else{//Cas ou le formulaire est incomplet
      let toastForm =this.toastCtrl.create({
        message: 'Veuillez remplir tous les champs s\'il vous plait',
        duration: 2000,
        position: 'bottom',
        cssClass: "toastStyle"
      });
      toastForm.present();
    }
  }

  //Pour le text-area
  resize() {
    this.myInput.nativeElement.style.height = this.myInput.nativeElement.scrollHeight + 'px';
  }
  //Fonction d'envoi de mail
  sendEmail(sujet: string, corps: string) {

    let email = {
      to: 'mohamedaseck@gmail.com',
      subject: sujet,
      body: corps,
      isHtml: true
    };
    // Send a text message using default options
    this.emailComposer.open(email);
    // this.alertMessage('DONE', 'L\'email a été envoyé');
  }

  //Alerte
  alertMessage(title, detail) {
    let alert = this.alertController.create({
      title: title.toString(),
      subTitle: detail.toString(),
      buttons: ['Fermer']
    });
    alert.present();
  }

  // sendEmail(sujet: string, corps: string) {
  //   let email = {
  //     to: 'mohamedaseck@gmail.com',
  //     cc: 'maseck@technosmartsn.com',
  //     subject: sujet,
  //     body: corps,
  //     isHtml: true
  //   };
  //   this.emailComposer.open(email);
  // }
}





// //Fonction d'envoi de mail
// sendEmail(sujet: string, corps: string) {
//   this.alertMessage('TEST', 'You can only send an email when running as an application');
//   if (this.platform.is('cordova')) {
    
//       this.emailComposer.isAvailable().then((available: boolean) => {
//         if (available) {
//           let email = {
//             to: 'mohamedaseck@gmail.com',
//             attachments: [
//             ],
//             subject: 'SABLUX MOBILE',
//             body: 'OK!!! OK!!!',
//             isHtml: true
//           };

//           // Send a text message using default options
//           this.emailComposer.open(email);
//         } else {
//           this.alertMessage('Email not available', "Email is not configured on this device, or this application doesn't have access to email");
//         }
//       });
    
//   } else {
//     this.alertMessage('Not running in device mode.', 'You can only send an email when running as an application');
//   }
// }