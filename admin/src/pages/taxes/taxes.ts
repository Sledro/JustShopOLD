import { Component } from '@angular/core';
import { NavController, ModalController, ActionSheetController } from 'ionic-angular';
import { TaxService } from '../../services/tax-service';
import { ModalTaxPage } from "../modal-tax/modal-tax";

/*
  Generated class for the LoginPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-taxes',
  templateUrl: 'taxes.html',
})
export class TaxesPage {
  taxes: any;

  constructor(public nav: NavController, public taxService: TaxService, public modalCtrl: ModalController,
              public actionSheetCtrl: ActionSheetController) {
    // get list of taxes from firebase
    this.taxes = taxService.getAll();
  }

  // add new Tax
  addTax() {
    let modal = this.modalCtrl.create(ModalTaxPage, {tax: null});
    modal.present();
  }

  // edit Tax
  editTax(tax) {
    let modal = this.modalCtrl.create(ModalTaxPage, {tax: tax});
    modal.present();
  }

  // show options
  showOptions(tax) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Action',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            // remove category
            this.taxService.removeRecord(tax.$key);
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
}
