import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { OnInit } from '@angular/core';

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
  typeContact : String;

  //METHODES LIFECYCLE
  constructor(public viewCtrl : ViewController, public navCtrl: NavController, public navParams: NavParams) {
  }

  ngOnInit(): void {
    this.typeContact = this.navParams.get('message');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactPage');
  }

  //METHODES LOGIQUE METIER
  public closeModal(){
    this.viewCtrl.dismiss();
}

}
