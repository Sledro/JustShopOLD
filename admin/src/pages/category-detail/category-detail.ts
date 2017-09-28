import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { CategoryService } from '../../services/category-service';
import { ItemDetailPage } from "../item-detail/item-detail";
import { ItemService } from "../../services/item-service";
import { FormBuilder, Validators } from "@angular/forms";
import * as firebase from 'firebase';

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-category-detail',
  templateUrl: 'category-detail.html',
})
export class CategoryDetailPage {
  items: any;
  category: any;
  categoryForm: any;
  isEditing = false;
  submitAttempt = false;

  constructor(public nav: NavController, public navParams: NavParams, public categoryService: CategoryService,
              public itemService: ItemService, public actionSheetCtrl: ActionSheetController,
              public formBuilder: FormBuilder) {
    // define form validator
    this.categoryForm = formBuilder.group({
      name: ['', Validators.compose([Validators.required])]
    });

    // set current editing category
    if (navParams.get('category')) {
      this.isEditing = true;
      this.category = navParams.get('category');
      this.items = itemService.findByCategory(this.category);
    } else {
      this.category = categoryService.getBlankRecord();
    }
  }

  // handle form submit
  submit() {
    this.submitAttempt = true;

    if (this.categoryForm.valid) {
      if (this.isEditing) {
        this.categoryService.updateRecord(this.category);
      } else {
        this.categoryService.addRecord(this.category).then(snapshot => this.category.$key = snapshot.key);
      }
      this.nav.pop();
    }
  }

  // choose file for upload
  chooseFile() {
    document.getElementById('file').click();
  }

  // upload thumb for category
  upload() {
    // Create a root reference
    let storageRef = firebase.storage().ref();

    // This currently only grabs category 0, TODO refactor it to grab them all
    for (let selectedFile of [(<HTMLInputElement>document.getElementById('file')).files[0]]) {
      let path = `/images/${selectedFile.name}`;
      let iRef = storageRef.child(path);
      iRef.put(selectedFile).then((snapshot) => {
        this.category.thumb = snapshot.downloadURL;
      });
    }
  }

  // add new item to this category
  addItem() {
    this.nav.push(ItemDetailPage, {category: this.category});
  }

  // view item detail
  viewItem(item) {
    this.nav.push(ItemDetailPage, {item: item});
  }

  // show options
  showOptions(item) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Action',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            // remove category
            this.itemService.removeRecord(item, this.category);
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
