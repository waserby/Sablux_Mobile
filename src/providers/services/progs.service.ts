import { Injectable } from '@angular/core';

//Modesl and Mocks
import { ProgrammeModel } from "../../models/programme-model";
import {PROGS} from "../../mocks/mock-programmes";

//Need for Observable return
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

@Injectable()
export class ProgsService {

  constructor() { }

  getProgs(): Observable<ProgrammeModel[]> {
    return of(PROGS);
  }
  
}


