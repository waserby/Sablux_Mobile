import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ProgsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProgsProvider {

  constructor(public http: HttpClient) {
    console.log('Hello ProgsProvider Provider');
  }

}
