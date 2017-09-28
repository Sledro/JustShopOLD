import { Injectable } from "@angular/core";
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AuthService } from "./auth-service";

@Injectable()
export class NotificationService {
  private notifications: FirebaseListObservable<any>;

  constructor(public db: AngularFireDatabase, public authService: AuthService) {
  }

  getAll() {
    let user = this.authService.getUserData();
    this.notifications = this.db.list('/notifications/' + user.uid);

    return this.notifications;
  }

  remove(item) {
    this.notifications.remove(item.$key)
  }
}
