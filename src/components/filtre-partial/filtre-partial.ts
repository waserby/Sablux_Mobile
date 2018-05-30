import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { ProgsProviderFireApi } from '../../providers/progs/progs';
import { Produit } from '../../models/produit-model';
import { ResultatListPartialComponent } from '../resultat-list-partial/resultat-list-partial';
import { ResultatRecherchePage } from '../../pages/resultat-recherche/resultat-recherche';
import { NavController, AlertController, Platform } from 'ionic-angular';

//Native
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Storage as Store } from '@ionic/storage';
import { ListeProgrammesPage } from '../../pages/liste-programmes/liste-programmes';

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
export class FiltrePartialComponent implements OnInit {
  @Input() itemStatut: String; // recoit le statut (Louer/Vendre) From Component Parent qui est Trouver-bien
  tabProduits: any;//Tableau de programme LOCAL: string;
  urlProduits: string;
  arrayZone: string[] = []; //Tableau des zone disponible dans les programmes de l'API
  //NG MODEL des inputs
  // inputs = {zone: "none", type: "none", prix: 100, etage: "none"};// On initialise pour les default entrie et on recupère en two way databinding
  inputs = { zone: "none", type: "none", prix: 0 };// On initialise pour les default entrie et on recupère en two way databinding

  //searchTerm: string = ''; // Terme entrer par le user dans le champ zone
  //Pour filtre template
  text: number = 0;

  //METHODES LIFECYCLE
  constructor(private plt: Platform, alertCtrl: AlertController, public storage: Store, private localNotifications: LocalNotifications, public navCtrl: NavController, private progsServiceFireApi: ProgsProviderFireApi) {
    this.plt.ready().then(() => {
      //TODO quand on clique une notif
      this.localNotifications.on('click').subscribe( notification => {
        //let json = JSON.parse(notification.data);
        //let produit = json.mydata;//je recupère la data qui est l'item
        //console.log("Notification Subscribed");
        //this.navCtrl.setRoot(ListeProgrammesPage, "{typeDeProgramme:'venir'}");
        //this.sendInputs({datafiltre: {zone: this.inputs.zone, type: this.inputs.type, prix: this.inputs.prix}});          // this.navCtrl.setRoot(ListeProgrammesPage, "{typeDeProgramme:'venir'}");
        // GOOD this.sendInputs({datafiltre: {zone: produit.zone, type: produit.typeproduit, prix: produit.price}});          // this.navCtrl.setRoot(ListeProgrammesPage, "{typeDeProgramme:'venir'}");
        let alert = alertCtrl.create({
          title: notification.title,
          subTitle: "La zone est :"+notification.data.zone+" et le type: "+notification.data.typeproduit ,
          buttons: [{
            text: 'Voir',
            handler: () => {
              //TODO quand on clique une notif
              this.sendInputs({datafiltre: {zone: notification.zone, type: notification.typeproduit, prix: notification.price}});          // this.navCtrl.setRoot(ListeProgrammesPage, "{typeDeProgramme:'venir'}");
            }
          }]
        });
        alert.present();
      })
    })//PLATFORM READY
  }// FIN contructeur

  ngOnInit(): void {
    this.urlProduits = 'http://seproerp.ddns.net:82/api/index.php/product/list?api_key=rvz6gy28';
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
        if (!donnee) {
          this.storage.set('produits', this.tabProduits);// Je STORE le tableau de produits pour les notifications        
        }
      })
        .catch(err => {
          console.log('Your data don\'t exist and returns error in catch: ' + JSON.stringify(err));
        });

      this.testNewProgramme(this.tabProduits);//On test si il y'a un nouveau programme

      //Pour les ZONES
      for (let item of this.tabProduits) {
        //console.log("Un produit :  "+item.zone+"  ID: "+item.id+" de type "+item.typeproduit+" et qui coute "+item.price);
        if ((this.arrayZone.indexOf(item.zone) == -1) && (item.zone !== null) && (item.zone !== "")) { //this.tabProduits.indexOf(item.zone) <= -1 
          this.arrayZone.push(item.zone);
        }
      }
      //console.log("Voici les zones : "+this.arrayZone.length);
    });
  }

  //Methode de VALIDATION DU FORMULAIRE
  sendInputs(valeur) {
    this.navCtrl.push('page-resultat-recherche', valeur);//J'envoi la valeur à travers un navCTRL
  }

  notifier(titre: string, text: string, item: any) {
    // Schedule a single notification
    this.localNotifications.schedule({
      title: "Un nouveau appartement est disponible",
      text: text,
      icon: 'assets/img/icon.png',
      data: item
    });
  }

  testNewProgramme(nouveauTabProduits) {
    let nbreNewProd;
    this.storage.get('produits').then((result) => {
      if (nouveauTabProduits.length >= result.length) {//Si le nouveau TabProduits est plus grand (>19)
        //Dans ce cas, on a un nouveau produit
        nbreNewProd = (nouveauTabProduits.length - result.length);
        console.log("Nombre de New ITEMS: " + nbreNewProd);
        //Boucle pour obtenir maxItemNumber
        let maxItemNumber: number = 0;
        for (let item of result) {
          let itemNumber = +item.id;
          console.log("ID result: " + itemNumber);
          if (itemNumber > maxItemNumber) {
            maxItemNumber = itemNumber;
          }
        }//Fin Boucle MAX item Number
        console.log("BIGGER ID : " + maxItemNumber);
        //On notifie si l'id de l'item de la nouvelle liste est supérieur au plus grand id d'item du tableau stocké
        for (let item of nouveauTabProduits) {
          let itemNumb = +item.id; //Transformer les lettres en chiffres

          if (itemNumb >= maxItemNumber) {
            //Je notifie car l'item a un id supérieur à 19
            let titreNotif: string = "SABLUX: Un nouvel appartement est disponible";
            let contenuNotif: string = "C'est un " + item.typeproduit + " situé à " + item.zone;
            this.notifier(titreNotif, contenuNotif, item);//On notifie
            console.log(" L'ID de l'item : " + itemNumb + " Son contenu" + item);

            //Je set encore la novelle liste de produits pour un prochain test
            this.storage.set('produits', this.tabProduits);// Je STORE le tableau de produits pour les notifications        
          } else {
            console.log("BAD ITEM: L'ID de l'item : " + itemNumb);
          }
        }

        
      } else {
        //Dans ce cas, Aucun produit n'a été ajouté
        console.log("Aucun Produit Ajouté");
      }
    });
  }

}





            //   this.localNotifications.on("click", (notification, state) => {

            //     let alert = this.alertCtrl.create({
            //       title: this.todos[this.num].info.nom_du_musee,
            //       subTitle: this.todos[this.num].info.periode_ouverture+" "+this.todos[this.num].info.adr+"  site web  "+this.todos[this.num].info.sitweb,
            //       buttons: [
            //         {
            //           text: 'OK',
            //           handler: () => {
            //             console.log('OK clicked');
            //           }
            //         }
            //       ]
            //     });

            //   alert.present()
            // });


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
