import { Injectable } from "@angular/core";
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Injectable()
export class ItemService {
  private items: FirebaseListObservable<any>;

  constructor(public db: AngularFireDatabase) {
    this.items = db.list('/items');
  }

  // list all record
  getAll() {
    return this.items;
  }

  // get all items by category
  findByCategory(catId, restId) {
    return this.db.list('/items/' + restId, {
      query: {
        orderByChild: 'category_id',
        equalTo: catId
      }
    })
  }
}
