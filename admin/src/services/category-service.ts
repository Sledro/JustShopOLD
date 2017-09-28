import { Injectable } from "@angular/core";
import { AngularFireDatabase } from 'angularfire2/database';
import { RestaurantService } from "./restaurant-service";
import { DEFAULT_CAT_THUMB } from "./constants";

@Injectable()
export class CategoryService {
  constructor(public db: AngularFireDatabase, public restaurantService: RestaurantService) {}

  // blank category for creation screen
  getBlankRecord() {
    return {
      $key: null,
      name: 'Untitled',
      thumb: DEFAULT_CAT_THUMB
    }
  }

  // list all record
  getAll() {
    const restId = this.restaurantService.getId();
    return this.db.list('restaurants/' + restId + '/categories');
  }

  // add new record
  addRecord(item) {
    return this.getAll().push({
      name: item.name,
      thumb: item.thumb,
      numberOfItems: 0
    });
  }

  // update record
  updateRecord(item) {
    this.getAll().update(item.$key, {
      name: item.name,
      thumb: item.thumb
    });
  }

  // remove record
  removeRecord(id) {
    this.getAll().remove(id);
  }

  // attach item to category
  attachItem(category) {
    category.numberOfItems++;
    this.getAll().update(category.$key, {
      numberOfItems: category.numberOfItems
    });
  }

  // detach item from category
  detachItem(category) {
    category.numberOfItems--;
    this.getAll().update(category.$key, {
      numberOfItems: category.numberOfItems
    });
  }
}
