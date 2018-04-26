import { Component } from '@angular/core';

/**
 * Generated class for the ProgrammesPartialComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'programmes-partial',
  templateUrl: 'programmes-partial.html'
})
export class ProgrammesPartialComponent {

  text: string;

  constructor() {
    console.log('Hello ProgrammesPartialComponent Component');
    this.text = 'Hello World';
  }

}
