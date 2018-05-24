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
  // apiUrl = 'http://seproerp.ddns.net:84/api/index.php/category/list/product?api_key=f5a06c52b2e8b6a31898da190f74d295';//URL API
  apiUrl = 'http://seproerp.ddns.net:84/api/index.php/category/list/product?api_key=f5a06c52b2e8b6a31898da190f74d295';//URL API
  
  //list<ProgrammeModel>('programmes-list');
  constructor(public http: HttpClient, private db: AngularFireDatabase) {
    console.log('Hello ProgsProvider Provider');
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
  restGet(url: string) {
    return new Promise(resolve => {
      this.http.get(url).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  //--------------API-REST--------------------
}
