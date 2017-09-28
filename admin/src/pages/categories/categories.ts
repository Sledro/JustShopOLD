import { Component } from '@angular/core';
import { NavController, ActionSheetController } from 'ionic-angular';

import { CategoryService } from '../../services/category-service';
import { CategoryDetailPage } from "../category-detail/category-detail";
import { ItemService } from "../../services/item-service";

/*
  Generated class for the LoginPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html',
})
export class CategoriesPage {
  categories: any;

  constructor(public nav: NavController, public categoryService: CategoryService, public itemService: ItemService,
              public actionSheetCtrl: ActionSheetController) {
    this.categories = categoryService.getAll();
  }

  // view category detail
  viewCat(cat) {
    this.nav.push(CategoryDetailPage, {category: cat});
  }

  // go to add category page
  addCat() {
    this.nav.push(CategoryDetailPage);
  }

  // show options
  showOptions(category) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Action',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            // remove category
            this.itemService.removeByCategory(category.$key);
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
