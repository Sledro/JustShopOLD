import { Injectable } from "@angular/core";
import { AngularFireDatabase } from 'angularfire2/database';
import { RestaurantService } from "./restaurant-service";

@Injectable()
export class NotificationService {
  constructor(public db: AngularFireDatabase, public restaurantService: RestaurantService) {

  }

  getAll() {
    const restId = this.restaurantService.getId();
    return this.db.list('/notifications/' + restId);
  }

  remove(item) {
    this.getAll().remove(item.$key)
  }
}
