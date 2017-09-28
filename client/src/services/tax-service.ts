import { Injectable } from "@angular/core";
import { AngularFireDatabase } from 'angularfire2/database';
import { ItemService } from "./item-service";

@Injectable()
export class TaxService {

  constructor(public db: AngularFireDatabase, public itemService: ItemService) {
  }

  getAll() {
    return this.db.object('/taxes');
  }
}
