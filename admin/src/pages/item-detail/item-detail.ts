import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ItemService } from "../../services/item-service";
import { FormBuilder, Validators } from "@angular/forms";
import { TaxService } from "../../services/tax-service";
import * as firebase from 'firebase';


/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html',
})
export class ItemDetailPage {
  isEditing = false;
  item: any;
  itemForm: any;
  sizeForm = [];
  optionForm = [];
  submitAttempt = false;
  taxes: any;

  constructor(public nav: NavController, public navParams: NavParams, public itemService: ItemService,
              public formBuilder: FormBuilder, public taxService: TaxService) {
    // define form validator
    this.itemForm = formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      sku: ['', Validators.compose([Validators.required])],
      price: ['', Validators.compose([Validators.required])],
    });

    // set list taxes for tax form
    this.taxes = taxService.getAll();

    // set current editing item
    if (navParams.get('item')) {
      this.isEditing = true;
      this.item = navParams.get('item');

      // need to set sizes and option as array
      if (!this.item.sizes) {
        this.item.sizes = [];
      }
      if (!this.item.options) {
        this.item.options = [];
      }
      if (!this.item.taxes) {
        this.item.taxes = {};
      }
    } else {
      this.item = itemService.getBlankRecord();
    }
  }

  // choose file for upload
  chooseFile() {
    document.getElementById('item-thumb').click();
  }

  // upload thumb for item
  upload() {
    // Create a root reference
    let storageRef = firebase.storage().ref();

    for (let selectedFile of [(<HTMLInputElement>document.getElementById('item-thumb')).files[0]]) {
      let path = `/images/${selectedFile.name}`;
      let iRef = storageRef.child(path);
      iRef.put(selectedFile).then((snapshot) => {
        this.item.thumb = snapshot.downloadURL;
      });
    }
  }

  // submit form
  submit() {
    this.submitAttempt = true;

    if (this.itemForm.valid) {
      // update current item
      if (this.isEditing) {
        this.itemService.updateRecord(this.item)
      } else {
        this.itemService.addRecord(this.item, this.navParams.get('category'));
      }

      this.nav.pop();
    }
  }

  // add sizes
  addSize() {
    this.item.sizes.push({
      name: '',
      price: ''
    })
    this.sizeForm.push(this.formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      price: ['', Validators.compose([Validators.required])],
    }));
  }

  // remove size from list
  removeSize(index) {
    this.item.sizes.splice(index, 1);
  }

  // add item option
  addOption() {
    this.item.options.push({
      name: '',
      price: ''
    });
    this.optionForm.push(this.formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      price: ['', Validators.compose([Validators.required])],
    }));
  }

  // remove option from list
  removeOption(index) {
    this.item.options.splice(index, 1);
  }
}
