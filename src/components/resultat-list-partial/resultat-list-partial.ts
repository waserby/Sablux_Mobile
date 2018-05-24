import { Component } from '@angular/core';

/**
 * Generated class for the ResultatListPartialComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'resultat-list-partial',
  templateUrl: 'resultat-list-partial.html'
})
export class ResultatListPartialComponent {

  text: string;

  constructor() {
    console.log('Hello ResultatListPartialComponent Component');
    this.text = 'Hello World';
  }

}
