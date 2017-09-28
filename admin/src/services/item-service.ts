import { Injectable } from "@angular/core";
import { AngularFireDatabase } from 'angularfire2/database';
import { CategoryService } from "./category-service";
import { RestaurantService } from "./restaurant-service";
import { DEFAULT_ITEM_THUMB } from "./constants";

@Injectable()
export class ItemService {
  constructor(public db: AngularFireDatabase, public categoryService: CategoryService,
              public restaurantService: RestaurantService) {
  }

  // get item url in firebase for query
  getUrl() {
    return 'items/' + this.restaurantService.getId();
  }

  // blank item for creation screen
  getBlankRecord() {
    return {
      $key: null,
      name: null,
      thumb: DEFAULT_ITEM_THUMB,
      price: '',
      sku: '',
      sizes: [],
      options: [],
      taxes: {}
    }
  }

  // list all record
  getAll() {
    return this.db.list(this.getUrl());
  }

  // get all and return as object
  getAllAsObject() {
    return this.db.object(this.getUrl());
  }

  // add new record
  addRecord(item, cat) {
    this.getAll().push({
      name: item.name,
      thumb: item.thumb,
      price: item.price,
      sku: item.sku,
      sizes: item.sizes,
      options: item.options,
      category_id: cat.$key,
      taxes: item.taxes
    });
    this.categoryService.attachItem(cat);
  }

  // find record by id
  getRecord(id) {
    return this.db.object('/items/' + id);
  }

  // update record
  updateRecord(item) {
    return this.getAll().update(item.$key, {
      name: item.name,
      thumb: item.thumb,
      price: item.price,
      sizes: item.sizes,
      options: item.options,
      taxes: item.taxes
    });
  }

  // apply taxes to items
  applyTax(item) {
    if (item.taxes) {
      return this.getAll().update(item.$key, {
        taxes: item.taxes
      });
    }

    return;
  }

  // remove record
  removeRecord(item, cat) {
    this.getAll().remove(item.$key);
    this.categoryService.detachItem(cat);
  }

  // get all items by category
  findByCategory(cat) {
    return this.db.list(this.getUrl(), {
      query: {
        orderByChild: 'category_id',
        equalTo: cat.$key
      }
    })
  }

  // delete item by category
  removeByCategory(catId) {
    this.db.list(this.getUrl(), {
      query: {
        orderByChild: 'category_id',
        equalTo: catId
      }
    }).subscribe(items => {
      items.forEach(item => {
        this.getAll().remove(item.$key);
      });
    });

    // remove category
    this.categoryService.removeRecord(catId);
  }
}
