import { Injectable } from "@angular/core";
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AuthService } from "./auth-service";
import 'rxjs/add/operator/map';

@Injectable()
export class OrderService {
  private orders: FirebaseListObservable<any>;

  constructor(public db: AngularFireDatabase, public authService: AuthService) {
  }

  // get all records
  getAll() {

    let user = this.authService.getUserData();
    this.orders = this.db.list('/orders/' + user.uid);

    return this.orders.map(arr => {
      return arr.reverse();
    });
  }

  // add record
  addRecord(restaurants, address) {
    let order = {
      address: address,
      restaurants: {},
    };

    Object.keys(restaurants).forEach(restId => {
      order.restaurants[restId] = {
        id: restaurants[restId].id,
        name: restaurants[restId].name,
        items: []
      };
      restaurants[restId].items.forEach(item => {
        order.restaurants[restId].items.push({
          item_id: item.item_id,
          name: item.name,
          options: item.options,
          option_names: item.option_names,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          thumb: item.thumb,
        });
      });
    });

    this.getAll();
    this.orders.push(order);
  }

  // find record by id
  getRecord(id) {
    let user = this.authService.getUserData();
    return this.db.object('/orders/' + user.uid + '/' + id);
  }
}
