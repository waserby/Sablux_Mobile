//Non utilisé

import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

@Injectable()
export class AlertOnce {
  public alertPresented: any;
  constructor(public alertCtrl: AlertController) {
    this.alertPresented = false
  }

  present(title, subTitle) {
    let vm = this
    if(!vm.alertPresented) {
      vm.alertPresented = true
      vm.alertCtrl.create({
        title: title,
        subTitle: subTitle,
        buttons: [{
          text: 'OK',
          handler: () => {
            vm.alertPresented = false
          }
        }],
      }).present();
    }
  }
}