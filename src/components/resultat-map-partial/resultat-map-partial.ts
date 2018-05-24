import { Component } from '@angular/core';

/**
 * Generated class for the ResultatMapPartialComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'resultat-map-partial',
  templateUrl: 'resultat-map-partial.html'
})
export class ResultatMapPartialComponent {

  text: string;

  constructor() {
    console.log('Hello ResultatMapPartialComponent Component');
    this.text = 'Hello World';
  }

}
