import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ItemService } from '../../services/item-service';
import { CategoryService } from '../../services/category-service';

/*
  Generated class for the LoginPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-items',
  templateUrl: 'items.html',
})
export class ItemsPage {

  constructor(public nav: NavController, public itemService: ItemService, public categoryService: CategoryService) {
  }
}
