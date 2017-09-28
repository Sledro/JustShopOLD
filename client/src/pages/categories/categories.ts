import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CategoryPage } from "../category/category";

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html'
})
export class CategoriesPage {
  restaurant: any;
  categories: Array<any> = [];

  constructor(public nav: NavController, public navParams: NavParams) {
    this.restaurant = this.navParams.get('restaurant');

    if (this.restaurant.categories) {
      Object.keys(this.restaurant.categories).forEach((key) => {
        let cat = this.restaurant.categories[key];
        cat.$key = key;
        this.categories.push(cat);
      });
    }
  }

  // view a category
  viewCategory(category) {
    this.nav.push(CategoryPage, {
      restaurant: this.restaurant,
      category: category
    });
  }
}
