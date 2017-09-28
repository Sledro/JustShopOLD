import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { TaxService } from '../../services/tax-service';
import { FormBuilder, Validators } from "@angular/forms";
import { ItemService } from "../../services/item-service";

/*
  Generated class for the LoginPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-modal-tax',
  templateUrl: 'modal-tax.html',
})
export class ModalTaxPage {
  tax: any;
  taxForm: any;
  isEditing = false;
  submitAttempt = false;
  items: any;

  constructor(public nav: NavController, public navParams: NavParams, public taxService: TaxService,
              public formBuilder: FormBuilder, public viewCtrl: ViewController, public itemService: ItemService) {
    // define form validator
    this.taxForm = formBuilder.group({
      enable: [''],
      name: ['', Validators.compose([Validators.required])],
      rate: ['', Validators.compose([Validators.required])],
      apply_items: ['', Validators.compose([Validators.required])],
    });

    // items for selector
    this.items = itemService.getAll();

    // set current editing modal-tax
    if (navParams.get('tax')) {
      this.isEditing = true;
      this.tax = navParams.get('tax');
    } else {
      this.tax = {
        enable: true,
        name: '',
        rate: 10,
        apply_items: []
      };
    }
  }

  // handle form submit
  submit() {
    this.submitAttempt = true;

    if (this.taxForm.valid) {
      if (this.isEditing) {
        this.taxService.updateRecord(this.tax);
      } else {
        this.taxService.addRecord(this.tax).then(snapshot => this.tax.$key = snapshot.key);
      }
      this.dismiss();
    }
  }

  // dismiss modal
  dismiss() {
    this.viewCtrl.dismiss();
  }
}
