import { Injectable } from "@angular/core";
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Injectable()
export class CategoryService {
  private categories: FirebaseListObservable<any>;

  constructor(public db: AngularFireDatabase) {
    this.categories = db.list('/categories');
  }

  // list all record
  getAll() {
    return this.categories;
  }
}
