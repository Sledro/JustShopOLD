import { Injectable } from "@angular/core";
import { AngularFireDatabase } from 'angularfire2/database';
import { RestaurantService } from "./restaurant-service";
import 'rxjs/add/operator/map';

@Injectable()
export class OrderService {
  constructor(public db: AngularFireDatabase, public restaurantService: RestaurantService) {
  }

  getAll() {
    const restId = this.restaurantService.getId();
    let orders = this.db.list('/orders');

    return orders.map(arr => {
      let orderArr = [];
      arr.forEach((orders) => {
        Object.keys(orders).map((key) => {
          let order = orders[key];
          // only get order, ignore other values
          if (order.created_at && order.restaurants[restId]) {
            order.$key = key;
            order.user_id = orders.$key;
            orderArr.push(order);
          }
        });
      });

      orderArr.sort((a, b) => {
        if (a.created_at > b.created_at) return -1;
        if (a.created_at < b.created_at) return 1;
        return 0;
      });

      return orderArr;
    });
  }

  // update status
  updateStatus(order, status) {
    const restId = this.restaurantService.getId();
    this.db.object('/orders/' + order.user_id + '/' + order.$key).update({
      updated_at: Date.now()
    });
    this.db.object('/orders/' + order.user_id + '/' + order.$key + '/restaurants/' + restId).update({
      status: status,
    });
  }
}
