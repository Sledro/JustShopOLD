import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CategoryPage } from "../category/category";
import { RestaurantService } from "../../services/restaurant-service";
import { CategoriesPage } from "../categories/categories";

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  // slides for slider
  public slides = [
    "assets/img/categories/fruit.jpg",
    "assets/img/categories/pizza.jpg",
    "assets/img/categories/sushi.jpg"
  ];

  // list of restaurant
  restaurants: any;

  constructor(public nav: NavController, public restaurantService: RestaurantService) {
    restaurantService.getAll().subscribe(snapshot => {
      this.restaurants = snapshot;

      // convert children categories to array
      this.restaurants.forEach((value, key) => {
        let count = 0;
        this.restaurants[key].cats = [];
        if (value.categories) {
          Object.keys(value.categories).forEach((catId) => {
            if (count < 6) {
              let cat = this.restaurants[key].categories[catId];
              cat.$key = catId;
              this.restaurants[key].cats.push(cat);
            }
            // limit to 6 cats
            count++;
          });
        }
      });
    });
  }

  // view a category
  viewCategory(restaurant, category) {
    this.nav.push(CategoryPage, {
      restaurant: restaurant,
      category: category
    });
  }

  // view list categories of restaurant
  viewRestaurant(restaurant) {
    this.nav.push(CategoriesPage, {restaurant: restaurant});
  }
}
