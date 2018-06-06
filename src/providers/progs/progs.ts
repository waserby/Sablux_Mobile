//Ce service recupère les programmes from API REST, ajoute quelque champ et commit sur Firebase

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { ProgrammeModel } from '../../models/programme-model';


/*
  Generated class for the ProgsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProgsProviderFireApi {
  private progsList = this.db.list<ProgrammeModel>("programmes-list");
  //Init for REST API
  token : string;
  login : string;
  password : string;
  urlApiServiceForToken : string;
  // apiUrl : string = 'http://seproerp.ddns.net:84/api/index.php/category/list/product?api_key=f5a06c52b2e8b6a31898da190f74d295';//URL API

  //list<ProgrammeModel>('programmes-list');
  constructor(public http: HttpClient, private db: AngularFireDatabase) {
    console.log('Hello ProgsProvider Provider');
    this.login = "devrestapi";
    this.password = "c9rk8fqh";
    this.urlApiServiceForToken = 'http://seproerp.ddns.net:82/api/index.php/login?login='+this.login+'&password='+this.password; //URL API;
    this.restGetToken(this.urlApiServiceForToken).then( dataToken => { //On recupère le token});
      this.token = dataToken.success.token;
    });
  }

  //------------------CRUD-FIREBASE------------------
  getProgsList(){
    return this.progsList;
  }

  addProg(item: ProgrammeModel){
    return this.progsList.push(item);
  }

  updateProg(item: ProgrammeModel) {
    return this.progsList.update(item.key, item);
  }

  removeProg(item: ProgrammeModel) {
      return this.progsList.remove(item.key);
  }
  //-------------END-CRUD-FIREBASE------------------

  //--------------API-REST--------------------
  //Cette méthode recupère le bon token à partir des username et password
  restGetToken(url: string): any{
    return new Promise(resolve => {
      this.http.get(url).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  //Cette méthode recupère les données JSON from
  restGet(url: string) : any {
    return new Promise(resolve => {
      this.restGetToken(this.urlApiServiceForToken).then( dataToken => { //On recupère le token});
        this.token = dataToken.success.token;

        let goodUrlToken = url+"api_key="+this.token;//Je reconstruit l'url recue
        this.http.get(goodUrlToken).subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        });//Fin subscribe

      });   
    });//Fin Promise
  }
  // restGet(url: string) : any {
  //   this.restGetToken(this.urlApiServiceForToken).then( dataToken => { this.token = dataToken.success.token}); //On recupère le token
  //   let goodUrlToken = url+this.token;//Je reconstruit l'url recue
  //   return new Promise(resolve => {
  //     this.http.get(url+this.token).subscribe(data => {
  //       resolve(data);
  //     }, err => {
  //       console.log(err);
  //     });
  //   });
  // }
  //---------FINN-----API-REST--------------------
}
