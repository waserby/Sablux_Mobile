import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker
} from '@ionic-native/google-maps';
import { Component, OnInit, Input } from "@angular/core/"; //2_ADD: ALL this for MAP
import { Platform, NavParams } from 'ionic-angular';
import { ProgsService } from '../../providers/services/progs.service';
import { ProgrammeModel } from '../../models/programme-model';


@Component({
  selector: 'googlemap-partial',
  templateUrl: 'googlemap-partial.html'
})

export class GooglemapPartialComponent {
  @Input() progForMap: ProgrammeModel; // On recoit le programme choisi from la page detail programme
  //Initialisation pour la MAP
  latitude: Number; //From Detail Programme
  longitude: Number; //From Detail Programme
  marker_title: String; //From Detail Programme

  //Pour la map
  map: GoogleMap;
  // //Initialisation des Programmes
  // progs: ProgrammeModel[];//Tableau de programme LOCAL
  // chooseprog: ProgrammeModel;


  //-----------------Constructeur et Methodes LIFECYCLE-------------------------------
  constructor(public platform: Platform, private progservice: ProgsService, public navParams: NavParams) {}

  // ngOnInit(){
  //   this.getProgs();//Je récupère la liste des programmes pour chercher dedans celui correspondant au id recu from la page listes des programmes
  //   this.chooseprog = this.progs[this.navParams.get('itemid')];//Je recupère le programme correspondant à l'id itemid
  //   console.log(this.chooseprog.id);
  // }
  ngOnInit(): void {
    // this.latitude = this.progForMap.latitude;
    // this.longitude = this.progForMap.longitude;
    // this.marker_title = this.progForMap.nom;latitude:14.699362, longitude:-17.463098
    // console.log("Nom : "+this.progForMap.nom+" Latitude : "+this.progForMap.tabUrlImg[0] );//TEST was
    this.latitude = this.progForMap.latitude;
    this.longitude = this.progForMap.longitude;
    this.marker_title = this.progForMap.nom;
    this.platform.ready().then(() => {
      this.loadMap();
    });
  }

  ionViewDidEnter() {
   
  }
  //FINNNN--------------Constructeur et Methodes LIFECYCLE-------------------------------



  //-----------------Methodes Appelées (Traitement)-------------------------------
  loadMap() {

   let mapOptions: GoogleMapOptions = {
     camera: {
        target: {
          lat: this.latitude,
          lng: this.longitude
        },
        zoom: 15,
        tilt: 30
      }
    };

   this.map = GoogleMaps.create('map_canvas', mapOptions); //map_canvas c'est l'id du div ou est afficher la map

   // Wait the MAP_READY before using any methods.
   this.map.one(GoogleMapsEvent.MAP_READY)
     .then(() => {
        console.log('Map is ready!');

        // Now you can use all methods safely.
        this.map.addMarker({
          // title: this.chooseprog.nom.toString(), //custom
          title: this.marker_title.toString(), //custom
          icon: 'green',
          animation: 'DROP',
          position: {
            lat: this.progForMap.latitude,
            lng: this.progForMap.longitude
          }
        })
        .then(marker => {
          marker.on(GoogleMapsEvent.MARKER_CLICK)
            .subscribe(() => {
              alert('clicked');
            });
        });

     });
  }

  //Methodes pour le PROGRAMME
  // getProgs(): void {//Methode qui recupère les programmes grace à la méthode créee dans le service.
  //   this.progservice.getProgs().subscribe(progs => this.progs = progs);
  // }

  //FINNNN-----------------Methodes Appelée (Traitement)-------------------------------

}
