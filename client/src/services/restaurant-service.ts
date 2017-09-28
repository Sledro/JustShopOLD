import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "angularfire2/database";

@Injectable()
export class RestaurantService {
  constructor(public db: AngularFireDatabase) {

  }

  // get all restaurant
  getAll() {
    return this.db.list('restaurants');
  }
}
