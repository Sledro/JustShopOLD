import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CategoryService } from '../../services/category-service';
import { ItemPage } from "../item/item";
import { ItemService } from "../../services/item-service";

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-category',
  templateUrl: 'category.html'
})
export class CategoryPage {
  items: any;
  category: any;
  restaurant: any;

  constructor(public nav: NavController, public categoryService: CategoryService, public navParams: NavParams,
              public itemService: ItemService) {
    this.category = navParams.get('category');
    this.restaurant = navParams.get('restaurant');
    this.items = itemService.findByCategory(this.category.$key, this.restaurant.$key);
  }

  // view item detail
  viewItem(item) {
    this.nav.push(ItemPage, {
      item: item,
      restaurant: this.restaurant
    })
  }
}
