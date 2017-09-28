import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "angularfire2/database";

@Injectable()
export class RestaurantService {
  id: any;

  constructor(public db: AngularFireDatabase) {
  }

  // create a new restaurant
  create(name) {
    return this.db.list('restaurants').push({
      name: name
    });
  }

  // get current restaurant object
  getCurrent() {
    return this.db.object('restaurants/' + this.id);
  }

  setId(id) {
    this.id = id;
  }

  getId() {
    return this.id;
  }

  // update restaurant info
  update(name, address) {
    this.db.object('restaurants/' + this.id).update({
      name: name,
      address: address
    });
  }
}
