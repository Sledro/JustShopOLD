import { Injectable } from "@angular/core";
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Injectable()
export class UserService {
  private users: FirebaseListObservable<any>;

  constructor(public db: AngularFireDatabase) {
    this.users = db.list('users');
  }

  getAll() {
    return this.users;
  }

  remove(user) {
    this.users.remove(user.$key);
  }
}
