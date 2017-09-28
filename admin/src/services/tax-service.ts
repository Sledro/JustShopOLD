import { Injectable } from "@angular/core";
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ItemService } from "./item-service";
import { RestaurantService } from "./restaurant-service";

@Injectable()
export class TaxService {
  private taxes: FirebaseListObservable<any>;

  constructor(public db: AngularFireDatabase, public itemService: ItemService, public restaurantService: RestaurantService) {
    const restId = restaurantService.getId();
    this.taxes = db.list('taxes/' + restId);
  }

  getAll() {
    return this.taxes;
  }

  // add new record
  addRecord(item) {

    return this.taxes.push({
      enable: item.enable,
      name: item.name,
      rate: item.rate,
      apply_items: item.apply_items
    }).then(tax => {
      this.applyTax(tax.$key, item.apply_items)
    });
  }

  // update tax
  updateRecord(item) {

    return this.taxes.update(item.$key, {
      enable: item.enable,
      name: item.name,
      rate: item.rate,
      apply_items: item.apply_items
    }).then(tax => {
      this.applyTax(item.$key, item.apply_items)
    });
  }

  // remove record
  removeRecord(id) {
    this.taxes.remove(id);
  }

  // apply taxes to items
  applyTax(taxId, applyItems) {
    this.itemService.getAll().take(1).subscribe(items => {

      // if list items is not empty
      if (items) {

        items.forEach(item => {
          // if this tax is applied to this item
          if (applyItems.indexOf(item.$key) > -1) {
            if (!item.taxes) {
              item.taxes = {};
            }
            item.taxes[taxId] = true;
          } else {
            if (item.taxes) {
              item.taxes[taxId] = false;
            }
          }

          this.itemService.applyTax(item);
        });
      }
    });
  }
}
